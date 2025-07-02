export interface Cell {
  id: string
  value: string
  formula?: string
  row: number
  col: number
  fontFamily?: string
  fontSize?: number
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

export interface SpreadsheetState {
  cells: Record<string, Cell>
  selectedCell: string | null
  selectedRange: string[]
  activeSheet: string
}

export interface ToolbarAction {
  id: string
  label: string
  icon: string
  action: () => void
}
