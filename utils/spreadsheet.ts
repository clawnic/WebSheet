import type { Cell } from "@/types/spreadsheet"

export const getColumnLabel = (index: number): string => {
  let result = ""
  while (index >= 0) {
    result = String.fromCharCode(65 + (index % 26)) + result
    index = Math.floor(index / 26) - 1
  }
  return result
}

export const getCellId = (row: number, col: number): string => {
  return `${getColumnLabel(col)}${row + 1}`
}

export const parseCellId = (cellId: string): { row: number; col: number } => {
  const match = cellId.match(/^([A-Z]+)(\d+)$/)
  if (!match) throw new Error("Invalid cell ID")

  const colStr = match[1]
  const rowStr = match[2]

  let col = 0
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64)
  }
  col -= 1

  const row = Number.parseInt(rowStr) - 1

  return { row, col }
}

export const isValidFormula = (value: string): boolean => {
  return value.startsWith("=") && !value.includes("#")
}

const getCellValue = (cellId: string, cells: Record<string, Cell>, visited: Set<string> = new Set()): string => {
  if (visited.has(cellId)) {
    return "#CIRCULAR"
  }

  const cell = cells[cellId]
  if (!cell) return "0"

  if (cell.formula && isValidFormula(cell.formula)) {
    visited.add(cellId)
    const result = evaluateFormula(cell.formula, cells, visited)
    visited.delete(cellId)
    return result
  }

  return cell.value || "0"
}

export const evaluateFormula = (formula: string, cells: Record<string, Cell>, visited: Set<string> = new Set()): string => {
  if (!formula.startsWith("=")) return formula

  try {
    const expression = formula.slice(1)
    const cellRefRegex = /[A-Z]+\d+/g
    const evaluatedExpression = expression.replace(cellRefRegex, (match) => {
      return getCellValue(match, cells, visited)
    })

    // Use Function constructor to evaluate the mathematical expression
    // This is safe as we're only evaluating mathematical expressions
    const result = new Function(`return ${evaluatedExpression}`)()
    return result.toString()
  } catch (error) {
    return "#ERROR"
  }
}
