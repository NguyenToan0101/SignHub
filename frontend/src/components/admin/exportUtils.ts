/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Utility to export tabular data to a Microsoft Excel-compatible file format.
 * Utilizes a Unicode UTF-8 Byte Order Mark (BOM) to guarantee that Vietnamese characters,
 * accents, and currency symbols render cleanly inside Microsoft Excel on both Windows and macOS.
 */
export function exportToExcel(
  data: any[],
  headers: string[],
  keyMap: string[],
  fileName: string
) {
  // UTF-8 BOM to force Excel to read UTF-8 properly
  let csvContent = "\uFEFF";
  
  // Append headers
  csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",") + "\r\n";
  
  // Append data rows
  data.forEach((row) => {
    const line = keyMap.map((key) => {
      let val = row[key];
      if (val === undefined || val === null) {
        val = "";
      } else if (typeof val === "object") {
        val = JSON.stringify(val);
      } else {
        val = String(val);
      }
      // Escape dual-quotes for standard CSV compatibility
      val = val.replace(/"/g, '""');
      return `"${val}"`;
    });
    csvContent += line.join(",") + "\r\n";
  });

  // Create a Blob containing the CSV data with spreadsheet MIME type
  const blob = new Blob([csvContent], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
