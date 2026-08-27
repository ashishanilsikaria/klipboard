// server.js — Custom Node.js entry point for ClipSync
// Boots Next.js + WebSocket server on the same port
// Uses CommonJS (require) — do NOT convert to ESM import

require('dotenv').config()

const { createServer } = require('http')
const { parse } = require('url')
const os = require('os')
const next = require('next')
const { WebSocketServer, WebSocket } = require('ws')
const clipboardy = require('clipboardy')

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('./generated/prisma');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  const wss = new WebSocketServer({ noServer: true })
  const nextUpgradeHandler = app.getUpgradeHandler()
  const clients = new Set()
  let lastClipboard = ''

  // Try to read current clipboard on startup
  try {
    lastClipboard = clipboardy.readSync()
  } catch (_) { }

  wss.on('connection', async (ws) => {
    clients.add(ws)
    console.log(`[WS] Client connected (total: ${clients.size})`)

    // On connect: send current blocks immediately
    try {
      const blocks = await getBlocksGroupedByDay()
      ws.send(JSON.stringify({ type: 'blocks_list', data: blocks }))
    } catch (err) {
      console.error('[WS] Error sending initial blocks:', err)
    }

    ws.on('message', async (raw) => {
      try {
        const msg = JSON.parse(raw.toString())

        switch (msg.type) {
          case 'get_blocks': {
            const blocks = await getBlocksGroupedByDay()
            ws.send(JSON.stringify({ type: 'blocks_list', data: blocks }))
            break
          }

          case 'send_block': {
            const block = await prisma.block.findUnique({ where: { id: msg.id } })
            if (block) {
              clipboardy.writeSync(block.content)
              lastClipboard = block.content
              console.log(`[WS] Block "${block.label}" sent to clipboard`)
            }
            break
          }

          case 'set_clipboard': {
            if (typeof msg.text === 'string') {
              clipboardy.writeSync(msg.text)
              lastClipboard = msg.text
              console.log(`[WS] Clipboard set from browser (${msg.text.length} chars)`)
            }
            break
          }

          case 'add_block': {
            await prisma.block.create({
              data: {
                label: msg.label,
                content: msg.content,
                isCode: msg.isCode || false,
                language: msg.language || null,
                date: msg.date,
                pinned: msg.pinned || false,
              },
            })
            console.log(`[WS] Block "${msg.label}" added`)
            // Broadcast fresh blocks to ALL clients
            const blocks = await getBlocksGroupedByDay()
            broadcast({ type: 'blocks_list', data: blocks })
            break
          }

          default:
            console.warn(`[WS] Unknown message type: ${msg.type}`)
        }
      } catch (err) {
        console.error('[WS] Error handling message:', err)
      }
    })

    ws.on('close', () => {
      clients.delete(ws)
      console.log(`[WS] Client disconnected (total: ${clients.size})`)
    })

    ws.on('error', (err) => {
      console.error('[WS] Client error:', err)
      clients.delete(ws)
    })
  })

  server.on('upgrade', (req, socket, head) => {
    const { pathname } = parse(req.url, true)

    if (pathname === '/ws') {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req)
      })
      return
    }

    nextUpgradeHandler(req, socket, head)
  })

  // Clipboard polling — every 500ms
  setInterval(() => {
    try {
      const current = clipboardy.readSync()
      if (current && current !== lastClipboard) {
        lastClipboard = current
        broadcast({ type: 'clipboard', text: current, timestamp: Date.now() })
      }
    } catch (_) {
      // Clipboard might contain non-text data or be empty — ignore
    }
  }, 500)

  function broadcast(payload) {
    const data = JSON.stringify(payload)
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    }
  }

  async function getBlocksGroupedByDay() {
    const blocks = await prisma.block.findMany({
      orderBy: [{ pinned: 'desc' }, { date: 'desc' }, { id: 'asc' }],
    })
    const map = {}
    for (const b of blocks) {
      if (!map[b.date]) map[b.date] = []
      map[b.date].push(b)
    }
    return Object.entries(map).map(([date, blocks]) => ({ date, blocks }))
  }

  const requestedPort = Number(process.env.PORT || 3000)
  const allowPortFallback = !process.env.PORT
  const maxPortAttempts = 10
  let activePort = Number.isFinite(requestedPort) ? requestedPort : 3000
  let startupLogged = false

  function logStartup() {
    if (startupLogged) {
      return
    }

    startupLogged = true
    console.log(`\n  ✦ klipboard running on http://localhost:${activePort}`)
    console.log(`  ✦ LAN access: http://${lanIP}:${activePort}`)
    console.log(`  ✦ WebSocket on same port\n`)
  }

  function startServer(port, attempt = 0) {
    activePort = port

    const onListenError = (err) => {
      if (err.code === 'EADDRINUSE' && allowPortFallback && attempt < maxPortAttempts) {
        const nextPort = port + 1
        console.warn(`[server] Port ${port} is in use, trying ${nextPort}`)
        startServer(nextPort, attempt + 1)
        return
      }

      throw err
    }

    server.once('error', onListenError)
    server.listen(port, '0.0.0.0', () => {
      server.removeListener('error', onListenError)
      logStartup()
    })
  }

  // Get local LAN IP, prioritizing WiFi adapters
  function getLocalIP() {
    const interfaces = os.networkInterfaces()
    const wifiNames = ['Wi-Fi', 'Wireless', 'wlan', 'wifi']
    const ethernetNames = ['Ethernet', 'eth']
    const virtualNames = ['vEthernet', 'VMware', 'VirtualBox', 'docker', 'Hyper-V']

    // First pass: Look for WiFi adapters
    for (const name of Object.keys(interfaces)) {
      if (wifiNames.some(wifi => name.toLowerCase().includes(wifi.toLowerCase()))) {
        for (const iface of interfaces[name]) {
          if (iface.family === 'IPv4' && !iface.internal) {
            return iface.address
          }
        }
      }
    }

    // Second pass: Look for Ethernet adapters
    for (const name of Object.keys(interfaces)) {
      if (ethernetNames.some(eth => name.toLowerCase().includes(eth.toLowerCase()))) {
        for (const iface of interfaces[name]) {
          if (iface.family === 'IPv4' && !iface.internal) {
            return iface.address
          }
        }
      }
    }

    // Third pass: Any non-virtual, non-internal IPv4 address
    for (const name of Object.keys(interfaces)) {
      if (!virtualNames.some(virt => name.toLowerCase().includes(virt.toLowerCase()))) {
        for (const iface of interfaces[name]) {
          if (iface.family === 'IPv4' && !iface.internal) {
            return iface.address
          }
        }
      }
    }

    return 'localhost'
  }

  const lanIP = getLocalIP()

  startServer(activePort)
})
