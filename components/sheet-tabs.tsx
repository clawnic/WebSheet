"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal } from "lucide-react"

export function SheetTabs() {
  const [activeSheet, setActiveSheet] = useState("Sheet1")
  const [sheets] = useState(["Sheet1", "Sheet2", "Sheet3"])

  const handleSheetClick = (sheetName: string) => {
    setActiveSheet(sheetName)
    console.log(`Switched to ${sheetName}`)
  }

  const handleAddSheet = () => {
    console.log("Add new sheet")
  }

  return (
    <div className="flex items-center gap-1 px-4 py-2 border-t bg-gray-50">
      <div className="flex items-center gap-1">
        {sheets.map((sheet) => (
          <button
            key={sheet}
            onClick={() => handleSheetClick(sheet)}
            className={`px-3 py-1 text-sm rounded-t border-t border-l border-r ${
              activeSheet === sheet
                ? "bg-white border-gray-300 text-gray-900"
                : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {sheet}
          </button>
        ))}

        <Button variant="ghost" size="sm" onClick={handleAddSheet} className="ml-2">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1" />

      <Button variant="ghost" size="sm">
        <MoreHorizontal className="w-4 h-4" />
      </Button>
    </div>
  )
}
