"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Check } from "lucide-react"
import type { Cell } from "@/types/spreadsheet"

interface FormulaBarProps {
  selectedCell: string | null
  // New props
  cells?: Record<string, Cell>
  onCellChange?: (cellId: string, value: string) => void
  // Legacy props
  cellValue?: string
  onValueChange?: (value: string) => void
  onConfirm?: () => void
  onCancel?: () => void
}

export function FormulaBar(props: FormulaBarProps) {
  const { selectedCell, cells, onCellChange, cellValue, onValueChange, onConfirm, onCancel } = props
  const [value, setValue] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (typeof cellValue === "string") {
      setValue(cellValue)
    } else if (selectedCell && cells) {
      const cell = cells[selectedCell]
      setValue(cell?.formula || cell?.value || "")
    }
  }, [selectedCell, cells, cellValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    setIsEditing(true)
    if (onValueChange) onValueChange(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (onConfirm) onConfirm()
      else if (onCellChange && selectedCell) onCellChange(selectedCell, value)
      setIsEditing(false)
    } else if (e.key === "Escape") {
      if (onCancel) onCancel()
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
    else if (selectedCell && cells) {
      const cell = cells[selectedCell]
      setValue(cell?.formula || cell?.value || "")
    }
    setIsEditing(false)
  }

  const handleConfirm = () => {
    if (onConfirm) onConfirm()
    else if (onCellChange && selectedCell) onCellChange(selectedCell, value)
    setIsEditing(false)
  }

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <div className="w-24 px-2 py-1 bg-gray-100 border rounded text-sm">
        {selectedCell || ""}
      </div>
      <div className="flex-1 flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2 py-1 border rounded text-sm"
          placeholder="Enter a value or formula..."
        />
        {isEditing && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCancel}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={handleConfirm}
              className="h-8 w-8"
            >
              <Check className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
