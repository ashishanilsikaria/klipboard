'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { ClipEntry, DayGroup, WsMessage, Block } from '@/types'

function getWebSocketUrl(serverAddress: string) {
  const address = serverAddress.trim()

  if (address.startsWith('ws://') || address.startsWith('wss://')) {
    const parsed = new URL(address)
    if (parsed.pathname === '/') {
      parsed.pathname = '/ws'
    }
    return parsed.toString()
  }

  const currentPort = window.location.port || '3000'
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const parsed = address.startsWith('http://') || address.startsWith('https://')
    ? new URL(address)
    : new URL(`${window.location.protocol}//${address}`)

  const hostname = parsed.hostname
  const port = parsed.port || currentPort

  return `${protocol}//${hostname}:${port}/ws`
}

export function useClipSync(serverAddress: string | null) {
  const [connected, setConnected] = useState(false)
  const [clipHistory, setClipHistory] = useState<ClipEntry[]>([])
  const [dayGroups, setDayGroups] = useState<DayGroup[]>([])
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null)
  const connectRef = useRef<() => void>(() => {})

  const connect = useCallback(() => {
    if (!serverAddress) return

    // Clean up existing connection
    if (ws.current) {
      ws.current.onclose = null
      ws.current.onerror = null
      ws.current.close()
    }

    const url = getWebSocketUrl(serverAddress)
    console.log(`[ClipSync] Connecting to ${url}...`)
    const socket = new WebSocket(url)
    ws.current = socket

    socket.onopen = () => {
      console.log('[ClipSync] Connected')
      setConnected(true)
      // Request blocks on connect
      socket.send(JSON.stringify({ type: 'get_blocks' }))
      // Clear reconnect timer
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current)
        reconnectTimer.current = null
      }
    }

    socket.onmessage = (event) => {
      try {
        const msg: WsMessage = JSON.parse(event.data)

        switch (msg.type) {
          case 'clipboard':
            setClipHistory((prev) => {
              // Deduplicate — don't add if the most recent entry has the same text
              if (prev.length > 0 && prev[0].text === msg.text) return prev
              return [{ text: msg.text, timestamp: msg.timestamp }, ...prev].slice(0, 100)
            })
            break

          case 'blocks_list':
            setDayGroups(msg.data)
            break
        }
      } catch (err) {
        console.error('[ClipSync] Failed to parse message:', err)
      }
    }

    socket.onclose = () => {
      console.log('[ClipSync] Disconnected')
      setConnected(false)
      ws.current = null
      // Auto-reconnect after 5 seconds
      if (serverAddress) {
        reconnectTimer.current = setTimeout(() => connectRef.current(), 5000)
      }
    }

    socket.onerror = (err) => {
      console.error('[ClipSync] WebSocket error:', err)
      setConnected(false)
    }
  }, [serverAddress])

  useEffect(() => {
    connectRef.current = connect
  }, [connect])

  useEffect(() => {
    if (serverAddress) {
      connect()
    }

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current)
      }
      if (ws.current) {
        ws.current.onclose = null // prevent reconnect on intentional close
        ws.current.close()
      }
    }
  }, [serverAddress, connect])

  const sendToClipboard = useCallback((text: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'set_clipboard', text }))
      // Optimistically add to clip history
      setClipHistory((prev) => [
        { text, timestamp: Date.now() },
        ...prev,
      ].slice(0, 100))
    }
  }, [])

  const sendBlock = useCallback((id: number) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'send_block', id }))
    }
  }, [])

  const addBlock = useCallback((payload: Omit<Block, 'id'>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'add_block', ...payload }))
    }
  }, [])

  const refreshBlocks = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'get_blocks' }))
    }
  }, [])

  return {
    connected,
    clipHistory,
    dayGroups,
    sendToClipboard,
    sendBlock,
    addBlock,
    refreshBlocks,
  }
}
