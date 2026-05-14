'use client'

import { useState, useCallback } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { ClipEntry } from '@/types'
import { Send, Clock, Copy, Check, MonitorSmartphone, ClipboardPaste } from 'lucide-react'

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const seconds = Math.floor(diff / 1000)
  if (seconds < 10) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

interface ClipboardTabProps {
  clipHistory: ClipEntry[]
  sendToClipboard: (text: string) => void
  connected: boolean
}

export function ClipboardTab({ clipHistory, sendToClipboard, connected }: ClipboardTabProps) {
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleSend = () => {
    if (text.trim() && connected) {
      sendToClipboard(text.trim())
      setText('')
      setSent(true)
      setTimeout(() => setSent(false), 1500)
    }
  }

  const handleCopyEntry = useCallback(async (entry: ClipEntry, index: number) => {
    try {
      await navigator.clipboard.writeText(entry.text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1500)
    } catch {
      // Fallback for non-HTTPS contexts
      const textarea = document.createElement('textarea')
      textarea.value = entry.text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1500)
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Send to Windows */}
      <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-3">
          <MonitorSmartphone className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-200">Send to Windows</h3>
        </div>
        <Textarea
          id="send-clipboard-textarea"
          placeholder="Paste or type text to send to Windows clipboard..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 resize-none mb-3"
        />
        <Button
          id="send-to-windows-button"
          onClick={handleSend}
          disabled={!text.trim() || !connected}
          className={`w-full gap-2 transition-all duration-300 ${
            sent
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25'
          }`}
        >
          {sent ? (
            <>
              <Check className="w-4 h-4" />
              Sent!
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send to Windows
            </>
          )}
        </Button>
      </div>

      {/* Clipboard History */}
      <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-1">
          <ClipboardPaste className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-slate-200">Windows Clipboard History</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">Click any entry to copy it to your browser clipboard</p>

        {clipHistory.length === 0 ? (
          <div className="py-12 text-center">
            <ClipboardPaste className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Nothing received yet</p>
            <p className="text-xs text-slate-600 mt-1">Copy something on Windows to see it here</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
            {clipHistory.map((entry, index) => (
              <button
                key={`${entry.timestamp}-${index}`}
                onClick={() => handleCopyEntry(entry, index)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  handleCopyEntry(entry, index)
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-900/50 border border-slate-700/30 hover:border-indigo-500/30 hover:bg-slate-800/50 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-slate-300 line-clamp-2 flex-1 font-mono break-all">
                    {entry.text}
                  </p>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {copiedIndex === index ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  <Clock className="w-3 h-3 text-slate-600" />
                  <span className="text-xs text-slate-600">{formatRelativeTime(entry.timestamp)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
