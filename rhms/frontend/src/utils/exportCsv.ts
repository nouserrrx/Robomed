/**
 * CSV Export Utility for Admin Dashboards
 * Downloads an array of objects as a properly formatted CSV file.
 */
export function exportToCSV<T extends Record<string, any>>(
  filename: string,
  data: T[],
  headers?: { key: keyof T; label: string }[]
) {
  if (!data || !data.length) return

  let csvContent = ''

  if (headers) {
    const headerRow = headers.map(h => `"${h.label.replace(/"/g, '""')}"`).join(',')
    csvContent += headerRow + '\r\n'

    data.forEach(row => {
      const line = headers
        .map(h => {
          const val = row[h.key] ?? ''
          return `"${String(val).replace(/"/g, '""')}"`
        })
        .join(',')
      csvContent += line + '\r\n'
    })
  } else {
    const keys = Object.keys(data[0])
    const headerRow = keys.map(k => `"${k.replace(/"/g, '""')}"`).join(',')
    csvContent += headerRow + '\r\n'

    data.forEach(row => {
      const line = keys
        .map(k => {
          const val = row[k] ?? ''
          return `"${String(val).replace(/"/g, '""')}"`
        })
        .join(',')
      csvContent += line + '\r\n'
    })
  }

  // BOM for UTF-8 Excel support
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
