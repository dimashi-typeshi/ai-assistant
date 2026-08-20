import type { VisualReport } from '../components/ReportsPanel';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildRows(report: VisualReport) {
  if (report.rows.length === 0) return '<p class="muted">В отчете нет строк для таблицы.</p>';

  return `
    <table>
      <thead>
        <tr>
          <th>Раздел</th>
          <th>Факт</th>
          <th>Статус</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        ${report.rows.map((row) => `
          <tr>
            <td>${escapeHtml(row.source)}</td>
            <td>${escapeHtml(row.fact)}</td>
            <td>${escapeHtml(row.status)}</td>
            <td>${escapeHtml(row.action)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function buildSections(report: VisualReport) {
  if (report.sections.length === 0) return '';

  return report.sections.map((section) => `
    <section>
      <h2>${escapeHtml(section.title)}</h2>
      <ul>
        ${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </section>
  `).join('');
}

function buildChart(report: VisualReport) {
  if (report.chart.length === 0) return '';

  return `
    <section>
      <h2>Цифры</h2>
      <ul>
        ${report.chart.map((item) => `
          <li><strong>${escapeHtml(item.label)}:</strong> ${item.value} - ${escapeHtml(item.detail)}</li>
        `).join('')}
      </ul>
    </section>
  `;
}

function getTextRows(report: VisualReport) {
  if (report.rows.length > 0) return report.rows;

  const sectionRows = report.sections.flatMap((section) => (
    section.items.map((item) => ({
      action: 'Проверить',
      fact: item,
      source: section.title,
      status: 'Инфо',
    }))
  ));

  if (sectionRows.length > 0) return sectionRows;

  return report.chart.map((item) => ({
    action: item.detail,
    fact: String(item.value),
    source: item.label,
    status: 'Цифра',
  }));
}

function padCell(value: string, size: number) {
  if (value.length > size) return `${value.slice(0, Math.max(0, size - 3))}...`;
  return value.padEnd(size, ' ');
}

export function formatReportText(report: VisualReport) {
  const headers = ['Раздел', 'Факт', 'Статус', 'Действие'];
  const tableRows = getTextRows(report).map((row) => [row.source, row.fact, row.status, row.action]);
  const widths = headers.map((header, index) => (
    Math.min(28, Math.max(header.length, ...tableRows.map((row) => row[index].length)))
  ));
  const makeLine = (cells: string[]) => `| ${cells.map((cell, index) => padCell(cell, widths[index])).join(' | ')} |`;
  const separator = `| ${widths.map((width) => '-'.repeat(width)).join(' | ')} |`;

  return [
    report.title,
    '',
    `Совет AI: ${report.advice}`,
    '',
    makeLine(headers),
    separator,
    ...tableRows.map(makeLine),
  ].join('\n');
}

export function printReportPdf(report: VisualReport) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;

  const html = `
    <!doctype html>
    <html lang="ru">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(report.title)}</title>
        <style>
          body {
            margin: 0;
            padding: 32px;
            color: #111816;
            font-family: Inter, Arial, sans-serif;
            line-height: 1.45;
          }
          h1 { margin: 0 0 10px; font-size: 28px; }
          h2 { margin: 24px 0 10px; font-size: 18px; }
          p { margin: 0 0 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 18px; }
          th, td {
            padding: 10px;
            border: 1px solid #d9e1de;
            text-align: left;
            vertical-align: top;
            word-break: break-word;
          }
          th { background: #e9f8ef; }
          tr { break-inside: avoid; }
          ul { padding-left: 20px; }
          li { margin: 6px 0; }
          .advice {
            padding: 14px;
            background: #e9f8ef;
            border: 1px solid #b7e4c7;
            border-radius: 8px;
          }
          .muted { color: #64706c; }
          @media print {
            body { padding: 18mm; }
          }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(report.title)}</h1>
        <p class="muted">${new Date().toLocaleDateString('ru-RU')}</p>
        <p class="advice"><strong>Совет AI:</strong> ${escapeHtml(report.advice)}</p>
        ${buildRows(report)}
        ${buildSections(report)}
        ${buildChart(report)}
        <script>
          window.addEventListener('load', () => {
            setTimeout(() => {
              window.focus();
              window.print();
            }, 250);
          });
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  return true;
}
