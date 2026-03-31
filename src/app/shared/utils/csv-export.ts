export function escapeCsvCell(value: string | number): string {
  const s = value == null ? '' : String(value);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function buildCsv(
  header: string[],
  rows: (string | number)[][],
): string {
  const lines = [
    header.map(escapeCsvCell),
    ...rows.map((r) => r.map(escapeCsvCell)),
  ];
  return lines.map((line) => line.join(',')).join('\r\n');
}

/** UTF-8 BOM helps Excel on Windows recognize encoding. */
export function downloadCsv(filename: string, csvBody: string): void {
  const blob = new Blob(['\uFEFF' + csvBody], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
