"use client"

import { Button } from "@/components/ui/button"
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  FlagIcon as BorderAll,
  ChevronDown,
  Percent,
  DollarSign,
} from "lucide-react"
import type { Cell } from "@/types/spreadsheet"

interface ToolbarProps {
  onAction: (action: string, value?: string | number) => void
  selectedCell: string | null
  cell?: Cell
}

export function Toolbar({ onAction, selectedCell, cell }: ToolbarProps) {
  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b bg-gray-50">
      {/* Undo/Redo */}
      <div className="flex items-center gap-1 mr-2">
        <Button variant="ghost" size="sm" onClick={() => onAction("undo")}>
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onAction("redo")}>
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Font formatting */}
      <div className="flex items-center gap-1 mr-2">
        <select
          className="px-2 py-1 text-sm border rounded"
          value={cell?.fontFamily || "Arial"}
          onChange={e => onAction("fontFamily", e.target.value)}
          disabled={!selectedCell}
        >
          <option>Arial</option>
          <option>Times New Roman</option>
          <option>Helvetica</option>
        </select>
        <select
          className="px-2 py-1 text-sm border rounded ml-1"
          value={cell?.fontSize || 12}
          onChange={e => onAction("fontSize", Number(e.target.value))}
          disabled={!selectedCell}
        >
          <option value={10}>10</option>
          <option value={11}>11</option>
          <option value={12}>12</option>
          <option value={14}>14</option>
          <option value={16}>16</option>
        </select>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Text formatting */}
      <div className="flex items-center gap-1 mr-2">
        <Button variant={cell?.bold ? "default" : "ghost"} size="sm" onClick={() => onAction("bold")}>
          <Bold className="w-4 h-4" />
        </Button>
        <Button variant={cell?.italic ? "default" : "ghost"} size="sm" onClick={() => onAction("italic")}>
          <Italic className="w-4 h-4" />
        </Button>
        <Button variant={cell?.underline ? "default" : "ghost"} size="sm" onClick={() => onAction("underline")}>
          <Underline className="w-4 h-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Alignment */}
      <div className="flex items-center gap-1 mr-2">
        <Button variant="ghost" size="sm" onClick={() => onAction("align-left")}>
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onAction("align-center")}>
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onAction("align-right")}>
          <AlignRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Colors and borders */}
      <div className="flex items-center gap-1 mr-2">
        <Button variant="ghost" size="sm" onClick={() => onAction("fill-color")}>
          <Palette className="w-4 h-4" />
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onAction("borders")}>
          <BorderAll className="w-4 h-4" />
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Number formatting */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => onAction("percent")}>
          <Percent className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onAction("currency")}>
          <DollarSign className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
