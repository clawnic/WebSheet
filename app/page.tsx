"use client"

import { useState } from "react"
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

  // --- Cell Change ---
  const handleCellChange = (cellId: string, value: string) => {
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
    setCells(prev => ({
      ...prev,
      [selectedCell]: {
        ...prev[selectedCell],
        ...format
      }
    }))
  }

  // --- Toolbar handlers ---
  const handleToolbar = (action: string, value?: string | number) => {
    if (action === "bold") updateCellFormat({ bold: !cells[selectedCell!]?.bold })
    else if (action === "italic") updateCellFormat({ italic: !cells[selectedCell!]?.italic })
    else if (action === "underline") updateCellFormat({ underline: !cells[selectedCell!]?.underline })
    else if (action === "fontFamily") updateCellFormat({ fontFamily: value as string })
    else if (action === "fontSize") updateCellFormat({ fontSize: value as number })
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