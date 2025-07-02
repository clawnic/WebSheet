"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Cell } from "../types/spreadsheet"
import { getColumnLabel, getCellId, evaluateFormula, isValidFormula, parseCellId } from "../utils/spreadsheet"

interface SpreadsheetGridProps {
  cells: Record<string, Cell>
  selectedCell: string | null
  onCellSelect: (cellId: string) => void
  onCellChange: (cellId: string, value: string) => void
}

export function SpreadsheetGrid({ cells, selectedCell, onCellSelect, onCellChange }: SpreadsheetGridProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const ROWS = 100
  const COLS = 26
  const defaultColWidth = 96 // px
  const [colWidths, setColWidths] = useState<number[]>(Array(COLS).fill(defaultColWidth))
  const resizingCol = useRef<number | null>(null)
  const startX = useRef<number>(0)
  const startWidth = useRef<number>(0)

  const handleCellClick = (cellId: string) => {
    onCellSelect(cellId)
    setEditingCell(cellId)
    const cell = cells[cellId]
    setEditValue(cell?.formula || cell?.value || "")
    console.log(`Selected and editing cell: ${cellId}`)
  }

  const handleCellDoubleClick = (cellId: string) => {
    // No-op or keep for future advanced editing
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (editingCell) {
        onCellChange(editingCell, editValue)
        setEditingCell(null)
        setEditValue("")
      }
    } else if (e.key === "Escape") {
      setEditingCell(null)
      setEditValue("")
    }
  }

  const handleInputBlur = () => {
    if (editingCell) {
      onCellChange(editingCell, editValue)
      setEditingCell(null)
      setEditValue("")
    }
  }

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingCell])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell || editingCell) return
      const { row, col } = parseCellId(selectedCell)
      let nextRow = row
      let nextCol = col
      if (e.key === "ArrowUp") {
        nextRow = Math.max(0, row - 1)
      } else if (e.key === "ArrowDown") {
        nextRow = Math.min(ROWS - 1, row + 1)
      } else if (e.key === "ArrowLeft") {
        nextCol = Math.max(0, col - 1)
      } else if (e.key === "ArrowRight") {
        nextCol = Math.min(COLS - 1, col + 1)
      } else {
        return
      }
      const nextCellId = getCellId(nextRow, nextCol)
      onCellSelect(nextCellId)
      e.preventDefault()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedCell, editingCell, onCellSelect])

  const getCellDisplayValue = (cellId: string): string => {
    const cell = cells[cellId]
    if (!cell) return ""

    if (cell.formula && isValidFormula(cell.formula)) {
      return evaluateFormula(cell.formula, cells)
    }

    return cell.value
  }

  const getCellStyle = (cell: Cell | undefined) => {
    return {
      fontFamily: cell?.fontFamily || "Arial",
      fontSize: (cell?.fontSize || 12) + "px",
      fontWeight: cell?.bold ? "bold" : "normal",
      fontStyle: cell?.italic ? "italic" : "normal",
      textDecoration: cell?.underline ? "underline" : "none",
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent, colIndex: number) => {
    e.preventDefault()
    resizingCol.current = colIndex
    startX.current = e.clientX
    startWidth.current = colWidths[colIndex]
    document.addEventListener("mousemove", handleResizeMouseMove)
    document.addEventListener("mouseup", handleResizeMouseUp)
  }

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (resizingCol.current === null) return
    const delta = e.clientX - startX.current
    setColWidths(widths => {
      const newWidths = [...widths]
      newWidths[resizingCol.current!] = Math.max(40, startWidth.current + delta)
      return newWidths
    })
  }

  const handleResizeMouseUp = () => {
    resizingCol.current = null
    document.removeEventListener("mousemove", handleResizeMouseMove)
    document.removeEventListener("mouseup", handleResizeMouseUp)
  }

  return (
    <div ref={gridRef} className="flex-1 overflow-auto bg-white">
      <div className="inline-block min-w-full">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="w-12 h-8 border border-gray-300 bg-gray-100 text-xs font-medium text-gray-600 sticky top-0 left-0 z-20"></th>
              {Array.from({ length: COLS }, (_, colIndex) => (
                <th
                  key={colIndex}
                  style={{ width: colWidths[colIndex] }}
                  className="relative h-8 border border-gray-300 bg-gray-100 text-xs font-medium text-gray-600 sticky top-0 z-10 group"
                >
                  {getColumnLabel(colIndex)}
                  <div
                    onMouseDown={e => handleResizeMouseDown(e, colIndex)}
                    className="absolute top-0 right-0 h-full w-2 cursor-col-resize group-hover:bg-blue-200"
                    style={{ zIndex: 30 }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROWS }, (_, rowIndex) => (
              <tr key={rowIndex}>
                <td className="w-12 h-6 border border-gray-300 bg-gray-100 text-xs font-medium text-gray-600 text-center sticky left-0 z-10">
                  {rowIndex + 1}
                </td>
                {Array.from({ length: COLS }, (_, colIndex) => {
                  const cellId = getCellId(rowIndex, colIndex)
                  const isSelected = selectedCell === cellId
                  const isEditing = editingCell === cellId
                  const displayValue = getCellDisplayValue(cellId)
                  const cell = cells[cellId]
                  return (
                    <td
                      key={cellId}
                      style={{ width: colWidths[colIndex] }}
                      className={`w-24 h-6 border border-gray-300 relative cursor-cell ${
                        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleCellClick(cellId)}
                      onDoubleClick={() => handleCellDoubleClick(cellId)}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={handleInputChange}
                          onKeyDown={handleInputKeyDown}
                          onBlur={handleInputBlur}
                          className="w-full h-full px-1 text-xs border-none outline-none bg-white"
                          style={getCellStyle(cell)}
                        />
                      ) : (
                        <div className="w-full h-full px-1 text-xs flex items-center overflow-hidden" style={getCellStyle(cell)}>
                          {displayValue}
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
