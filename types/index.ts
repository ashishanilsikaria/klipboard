export interface Block {
  id: number
  label: string
  content: string
  isCode: boolean
  language: string | null
  date: string
  pinned: boolean
}

export interface DayGroup {
  date: string
  blocks: Block[]
}

export interface ClipEntry {
  text: string
  timestamp: number
}

export type WsMessage =
  | { type: 'clipboard'; text: string; timestamp: number }
  | { type: 'blocks_list'; data: DayGroup[] }
