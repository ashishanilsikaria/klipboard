'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import type { Block } from '@/types'
import { Plus, CalendarIcon, Code2, FileText } from 'lucide-react'
import { format } from 'date-fns'

interface AddBlockDialogProps {
  addBlock: (payload: Omit<Block, 'id'>) => void
  connected: boolean
}

export function AddBlockDialog({ addBlock, connected }: AddBlockDialogProps) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [content, setContent] = useState('')
  const [isCode, setIsCode] = useState(false)
  const [language, setLanguage] = useState('')
  const [date, setDate] = useState<Date>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)

  const reset = () => {
    setLabel('')
    setContent('')
    setIsCode(false)
    setLanguage('')
    setDate(new Date())
  }

  const handleSubmit = () => {
    if (!label.trim() || !content.trim()) return
    addBlock({
      label: label.trim(),
      content: content.trim(),
      isCode,
      language: isCode ? language.trim() || null : null,
      date: format(date, 'yyyy-MM-dd'),
      pinned: false,
    })
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
      <DialogTrigger
        id="add-block-button"
        disabled={!connected}
        className="inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium h-8 px-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 disabled:opacity-50"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Block
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700/50 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">Add New Block</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Label */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Label *</label>
            <Input
              id="block-label-input"
              placeholder="e.g. SSH Config, API Key, Meeting Notes"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Content *</label>
            <Textarea
              id="block-content-textarea"
              placeholder="Paste or type your content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 resize-none font-mono text-sm"
            />
          </div>

          {/* Type Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <div className="flex items-center gap-2">
              {isCode ? <Code2 className="w-4 h-4 text-cyan-400" /> : <FileText className="w-4 h-4 text-indigo-400" />}
              <span className="text-sm text-slate-300">{isCode ? 'Code block' : 'Plain text'}</span>
            </div>
            <Switch id="block-type-switch" checked={isCode} onCheckedChange={setIsCode} />
          </div>

          {/* Language (conditional) */}
          {isCode && (
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Language</label>
              <Input
                id="block-language-input"
                placeholder="e.g. javascript, python, bash"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500"
              />
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Date</label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger
                id="block-date-picker"
                className="w-full flex items-center justify-start gap-2 rounded-md border px-3 py-2 text-sm bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50"
              >
                <CalendarIcon className="w-4 h-4 text-slate-400" />
                {format(date, 'EEEE, MMMM d yyyy')}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => { if (d) { setDate(d); setCalendarOpen(false) } }}
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Submit */}
          <Button
            id="submit-block-button"
            onClick={handleSubmit}
            disabled={!label.trim() || !content.trim()}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Block
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
