import ExcelJS from 'exceljs'

export function styleCell(cell: ExcelJS.Cell, bgColor?: string) {
  if (!cell.value) cell.value = ''

  if (bgColor) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: bgColor },
    }
  }

  cell.border = {
    top: { style: 'thin', color: { argb: 'FF000000' } },
    left: { style: 'thin', color: { argb: 'FF000000' } },
    bottom: { style: 'thin', color: { argb: 'FF000000' } },
    right: { style: 'thin', color: { argb: 'FF000000' } },
  }
}