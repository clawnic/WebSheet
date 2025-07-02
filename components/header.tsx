"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Users, Star, Clock, MoreHorizontal } from "lucide-react"

export function Header() {
  const [activeTab, setActiveTab] = useState("home")
  const [spreadsheetName, setSpreadsheetName] = useState("Untitled spreadsheet")
  const [editingName, setEditingName] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [editingName])

  const tabs = [
    { id: "home", label: "Home" },
    { id: "insert", label: "Insert" },
    { id: "page-layout", label: "Page Layout" },
    { id: "formulas", label: "Formulas" },
    { id: "data", label: "Data" },
    { id: "review", label: "Review" },
    { id: "view", label: "View" },
  ]

  return (
    <div className="border-b bg-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-green-600" />
            {editingName ? (
              <input
                ref={nameInputRef}
                type="text"
                value={spreadsheetName}
                onChange={e => setSpreadsheetName(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === "Escape") setEditingName(false)
                }}
                className="font-semibold border rounded px-1 py-0.5 text-sm w-48"
              />
            ) : (
              <span
                className="font-semibold cursor-pointer hover:bg-gray-100 px-1 rounded"
                onClick={() => setEditingName(true)}
                title="Rename spreadsheet"
              >
                {spreadsheetName}
              </span>
            )}
            <Star className="w-4 h-4 text-gray-400 hover:text-yellow-500 cursor-pointer" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Clock className="w-4 h-4 mr-1" />
            Last edit was 2 minutes ago
          </Button>
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-1" />
            Share
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              console.log(`Switched to ${tab.label} tab`)
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
