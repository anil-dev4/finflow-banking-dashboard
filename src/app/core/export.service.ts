import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

/** Quote CSV fields and neutralise spreadsheet formula prefixes in user-supplied text. */
export function toCsv(rows: readonly (readonly (string | number)[])[]): string {
  return rows
    .map((row) =>
      row
        .map((value) => {
          const text = String(value);
          const safe = typeof value === 'string' && /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
          return `"${safe.replace(/"/g, '""')}"`;
        })
        .join(','),
    )
    .join('\r\n');
}

@Injectable({ providedIn: 'root' })
export class ExportService {
  private readonly document = inject(DOCUMENT);
  download(filename: string, rows: readonly (readonly (string | number)[])[]): void {
    const url = URL.createObjectURL(
      new Blob(['\uFEFF', toCsv(rows)], { type: 'text/csv;charset=utf-8;' }),
    );
    const link = this.document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  print(): void {
    this.document.defaultView?.print();
  }
}
