'use client'

import { Button } from '@/components/ui/button'
import { BlockCard, DaySection } from '@/components/DaySection'
import { AddBlockDialog } from '@/components/AddBlockDialog'
import type { DayGroup, Block } from '@/types'
import { Pin, RefreshCw, Database } from 'lucide-react'

interface BlocksTabProps {
  dayGroups: DayGroup[]
  sendBlock: (id: number) => void
  addBlock: (payload: Omit<Block, 'id'>) => void
  refreshBlocks: () => void
  connected: boolean
}

export function BlocksTab({ dayGroups, sendBlock, addBlock, refreshBlocks, connected }: BlocksTabProps) {
  const pinnedBlocks = dayGroups.flatMap((group) => group.blocks.filter((block) => block.pinned))
  const regularDayGroups = dayGroups
    .map((group) => ({
      ...group,
      blocks: group.blocks.filter((block) => !block.pinned),
    }))
    .filter((group) => group.blocks.length > 0)
  const regularBlockCount = regularDayGroups.reduce((acc, g) => acc + g.blocks.length, 0)

  return (
    <div>
      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-500">
          {regularBlockCount} blocks across {regularDayGroups.length} day{regularDayGroups.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2">
          <Button
            id="refresh-blocks-button"
            variant="ghost"
            size="sm"
            onClick={refreshBlocks}
            disabled={!connected}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50 gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
          <AddBlockDialog addBlock={addBlock} connected={connected} />
        </div>
      </div>

      {pinnedBlocks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 uppercase tracking-wider whitespace-nowrap">
              <Pin className="w-3.5 h-3.5" />
              Pinned
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-500/40 to-transparent" />
          </div>
          <div className="space-y-3">
            {pinnedBlocks.map((block) => (
              <BlockCard key={block.id} block={block} sendBlock={sendBlock} />
            ))}
          </div>
        </div>
      )}

      {/* Day Sections */}
      {regularDayGroups.length === 0 && pinnedBlocks.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-slate-800/30 border border-slate-700/30">
          <Database className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No blocks yet</p>
          <p className="text-xs text-slate-600 mt-1">Add your first text or code block to get started</p>
        </div>
      ) : regularDayGroups.length > 0 ? (
        <div className="space-y-6">
          {regularDayGroups.map((group) => (
            <DaySection
              key={group.date}
              date={group.date}
              blocks={group.blocks}
              sendBlock={sendBlock}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
