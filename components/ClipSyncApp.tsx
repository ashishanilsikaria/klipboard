'use client'

import { useState, useSyncExternalStore } from 'react'
import { useClipSync } from '@/hooks/useClipSync'
import { ClipboardTab } from '@/components/ClipboardTab'
import { BlocksTab } from '@/components/BlocksTab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Clipboard, Database, Wifi, WifiOff, ArrowRight, Zap } from 'lucide-react'

function subscribeToHostChange() {
  return () => { }
}

function getBrowserHost() {
  return window.location.host
}

function getServerHost() {
  return ''
}

export function ClipSyncApp() {
  const browserHost = useSyncExternalStore(subscribeToHostChange, getBrowserHost, getServerHost)
  const [connectionEnabled, setConnectionEnabled] = useState(true)
  const [manualAddress, setManualAddress] = useState<string | null>(null)
  const [addressInput, setAddressInput] = useState('')
  const serverAddress = connectionEnabled ? (manualAddress ?? (browserHost || null)) : null
  const hook = useClipSync(serverAddress)

  const handleConnect = () => {
    const address = addressInput.trim()
    if (address) {
      setManualAddress(address)
      setConnectionEnabled(true)
    }
  }

  const handleDisconnect = () => {
    setConnectionEnabled(false)
    setAddressInput(manualAddress ?? browserHost)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Zap className="w-5 h-5 text-white" />
              </div>
              {hook.connected && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">klipboard</h1>
              <p className="text-xs text-slate-400">Real-time clipboard bridge</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hook.connected ? (
              <>
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 gap-1.5 px-3 py-1">
                  <Wifi className="w-3 h-3" />
                  Connected
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDisconnect}
                  className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs"
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Badge className="bg-red-500/15 text-red-400 border-red-500/30 gap-1.5 px-3 py-1">
                <WifiOff className="w-3 h-3" />
                Disconnected
              </Badge>
            )}
          </div>
        </header>

        {/* Connection Panel */}
        {!hook.connected && !serverAddress && (
          <div className="mb-6 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3">
              <Wifi className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-slate-200">Connect to Windows Host</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Use the same address this page was opened from, or enter another Windows host address.
            </p>
            <div className="flex gap-2">
              <Input
                id="ip-input"
                placeholder="e.g. 192.168.1.10:3000"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
              />
              <Button
                id="connect-button"
                onClick={handleConnect}
                disabled={!addressInput.trim()}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 gap-2"
              >
                Connect
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Reconnecting Banner */}
        {serverAddress && !hook.connected && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm text-amber-300">Connecting to {serverAddress}...</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
              className="ml-auto text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 text-xs"
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="clipboard" className="w-full">
          <TabsList className="w-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-1 rounded-xl">
            <TabsTrigger
              value="clipboard"
              className="flex-1 gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:border-indigo-500/30 data-[state=active]:border text-slate-400 rounded-lg transition-all duration-200"
            >
              <Clipboard className="w-4 h-4" />
              Clipboard
            </TabsTrigger>
            <TabsTrigger
              value="blocks"
              className="flex-1 gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:border-indigo-500/30 data-[state=active]:border text-slate-400 rounded-lg transition-all duration-200"
            >
              <Database className="w-4 h-4" />
              Blocks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clipboard" className="mt-4">
            <ClipboardTab
              clipHistory={hook.clipHistory}
              sendToClipboard={hook.sendToClipboard}
              connected={hook.connected}
            />
          </TabsContent>

          <TabsContent value="blocks" className="mt-4">
            <BlocksTab
              dayGroups={hook.dayGroups}
              sendBlock={hook.sendBlock}
              addBlock={hook.addBlock}
              refreshBlocks={hook.refreshBlocks}
              connected={hook.connected}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
