"use client"

import { useState, useRef } from "react"
import { Header } from "@/components/header"
import { SpreadsheetGrid } from "@/components/spreadsheet-grid"
import { Toolbar } from "@/components/toolbar"
import { FormulaBar } from "@/components/formula-bar"
import { SheetTabs } from "@/components/sheet-tabs"
import type { Cell } from "@/types/spreadsheet"

export default function Page() {
  const [cells, setCells] = useState<Record<string, Cell>>({})
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  const [activeSheet, setActiveSheet] = useState("Sheet1")
  const [undoStack, setUndoStack] = useState<Record<string, Cell>[]>([])
  const [redoStack, setRedoStack] = useState<Record<string, Cell>[]>([])

  // --- Undo/Redo ---
  const pushUndo = (cells: Record<string, Cell>) => setUndoStack(stack => [...stack, { ...cells }])
  const handleUndo = () => {
    setUndoStack(stack => {
      if (stack.length === 0) return stack
      setRedoStack(rstack => [...rstack, { ...cells }])
      setCells(stack[stack.length - 1])
      return stack.slice(0, -1)
    })
  }
  const handleRedo = () => {
    setRedoStack(stack => {
      if (stack.length === 0) return stack
      pushUndo(cells)
      setCells(stack[stack.length - 1])
      return stack.slice(0, -1)
    })
  }

  // --- Cell Change ---
  const handleCellChange = (cellId: string, value: string) => {
    pushUndo(cells)
    setCells(prev => ({
      ...prev,
      [cellId]: {
        ...prev[cellId],
        id: cellId,
        value: value,
        formula: value.startsWith("=") ? value : undefined,
        row: parseInt(cellId.match(/\d+/)?.[0] || "0"),
        col: cellId.charCodeAt(0) - 65
      }
    }))
  }

  // --- Formatting ---
  const updateCellFormat = (format: Partial<Cell>) => {
    if (!selectedCell) return
    pushUndo(cells)
    setCells(prev => ({
      ...prev,
      [selectedCell]: {
        ...prev[selectedCell],
        ...format
      }
    }))
  }

  // --- Toolbar handlers ---
  const handleToolbar = (action: string, value?: any) => {
    if (action === "undo") handleUndo()
    else if (action === "redo") handleRedo()
    else if (action === "bold") updateCellFormat({ bold: !cells[selectedCell!]?.bold })
    else if (action === "italic") updateCellFormat({ italic: !cells[selectedCell!]?.italic })
    else if (action === "underline") updateCellFormat({ underline: !cells[selectedCell!]?.underline })
    else if (action === "fontFamily") updateCellFormat({ fontFamily: value })
    else if (action === "fontSize") updateCellFormat({ fontSize: value })
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <Toolbar
        onAction={handleToolbar}
        selectedCell={selectedCell}
        cell={selectedCell ? cells[selectedCell] : undefined}
      />
      <FormulaBar 
        selectedCell={selectedCell} 
        cells={cells}
        onCellChange={handleCellChange}
      />
      <div className="flex-1 overflow-auto">
        <SpreadsheetGrid 
          cells={cells}
          selectedCell={selectedCell}
          onCellSelect={setSelectedCell}
          onCellChange={handleCellChange}
        />
      </div>
      <SheetTabs 
        activeSheet={activeSheet}
        onSheetChange={setActiveSheet}
      />
    </div>
  )
}