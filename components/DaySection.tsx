'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/CodeBlock'
import type { Block } from '@/types'
import { Send, Check, ChevronDown, ChevronUp, FileText, Code2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'

interface DaySectionProps {
  date: string
  blocks: Block[]
  sendBlock: (id: number) => void
}

export function DaySection({ date, blocks, sendBlock }: DaySectionProps) {
  const formattedDate = (() => {
    try {
      return format(parseISO(date), 'EEEE, MMMM d yyyy')
    } catch {
      return date
    }
  })()

  return (
    <div>
      {/* Day Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
          {formattedDate}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-700/50 to-transparent" />
      </div>

      {/* Block Cards */}
      <div className="space-y-3">
        {blocks.map((block) => (
          <BlockCard key={block.id} block={block} sendBlock={sendBlock} />
        ))}
      </div>
    </div>
  )
}

interface BlockCardProps {
  block: Block
  sendBlock: (id: number) => void
}

export function BlockCard({ block, sendBlock }: BlockCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    sendBlock(block.id)
    setSent(true)
    setTimeout(() => setSent(false), 1500)
  }

  const isLong = !block.isCode && block.content.split('\n').length > 4

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl hover:border-slate-600/50 transition-all duration-200 overflow-hidden">
      <CardContent className="p-4">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {block.isCode ? (
              <div className="w-6 h-6 rounded-md bg-cyan-500/15 flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-md bg-indigo-500/15 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
              </div>
            )}
            <span className="text-sm font-semibold text-slate-200">{block.label}</span>
            {block.isCode && block.language && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {block.language}
              </span>
            )}
          </div>
          <Button
            id={`send-block-${block.id}`}
            size="sm"
            onClick={handleSend}
            className={`gap-1.5 text-xs transition-all duration-300 ${
              sent
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                : 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/25'
            }`}
            variant="outline"
          >
            {sent ? (
              <>
                <Check className="w-3 h-3" />
                Sent!
              </>
            ) : (
              <>
                <Send className="w-3 h-3" />
                Send
              </>
            )}
          </Button>
        </div>

        {/* Content */}
        {block.isCode ? (
          <CodeBlock language={block.language || 'plaintext'} code={block.content} />
        ) : (
          <div>
            <p className={`text-sm text-slate-400 whitespace-pre-wrap break-words ${!expanded && isLong ? 'line-clamp-4' : ''}`}>
              {block.content}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    Show more
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
