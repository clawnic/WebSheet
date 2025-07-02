"use client"

import { useState, useCallback } from "react"
import { Header } from "./components/header"
import { Toolbar } from "./components/toolbar"
import { FormulaBar } from "./components/formula-bar"
import { SpreadsheetGrid } from "./components/spreadsheet-grid"
import { SheetTabs } from "./components/sheet-tabs"
import type { Cell } from "./types/spreadsheet"
import { parseCellId, isValidFormula } from "./utils/spreadsheet"

export default function App() {
  const [cells, setCells] = useState<Record<string, Cell>>({})
  const [selectedCell, setSelectedCell] = useState<string | null>("A1")
  const [formulaBarValue, setFormulaBarValue] = useState("")
  const [activeSheet, setActiveSheet] = useState("Sheet1")

  const handleCellSelect = useCallback(
    (cellId: string) => {
      setSelectedCell(cellId)
      const cell = cells[cellId]
      setFormulaBarValue(cell?.formula || cell?.value || "")
    },
    [cells],
  )

  const handleCellChange = useCallback((cellId: string, value: string) => {
    const { row, col } = parseCellId(cellId)

    const newCell: Cell = {
      id: cellId,
      value: isValidFormula(value) ? "" : value,
      formula: isValidFormula(value) ? value : undefined,
      row,
      col,
    }

    setCells((prev) => ({
      ...prev,
      [cellId]: newCell,
    }))

    console.log(`Cell ${cellId} updated:`, newCell)
  }, [])

  const handleFormulaBarChange = (value: string) => {
    setFormulaBarValue(value)
  }

  const handleFormulaBarConfirm = () => {
    if (selectedCell) {
      handleCellChange(selectedCell, formulaBarValue)
    }
  }

  const handleFormulaBarCancel = () => {
    const cell = cells[selectedCell || ""]
    setFormulaBarValue(cell?.formula || cell?.value || "")
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      <Toolbar
        onAction={() => {}}
        selectedCell={selectedCell}
        cell={selectedCell ? cells[selectedCell] : undefined}
      />
      <FormulaBar
        selectedCell={selectedCell}
        cellValue={formulaBarValue}
        onValueChange={handleFormulaBarChange}
        onConfirm={handleFormulaBarConfirm}
        onCancel={handleFormulaBarCancel}
      />
      <SpreadsheetGrid
        cells={cells}
        selectedCell={selectedCell}
        onCellSelect={handleCellSelect}
        onCellChange={handleCellChange}
      />
      <SheetTabs activeSheet={activeSheet} onSheetChange={setActiveSheet} />
    </div>
  )
}
