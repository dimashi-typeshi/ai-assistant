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
  if (report.rows.length === 0) {
    return '<p class="muted">В отчете нет строк для таблицы.</p>';
  }

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
          <li><strong>${escapeHtml(item.label)}:</strong> ${item.value} — ${escapeHtml(item.detail)}</li>
        `).join('')}
      </ul>
    </section>
  `;
}

export function formatReportText(report: VisualReport) {
  const lines = [
    report.title,
    '',
    `Совет AI: ${report.advice}`,
    '',
    ...report.rows.map((row) => `${row.source}: ${row.fact}. Статус: ${row.status}. Действие: ${row.action}`),
    ...report.sections.flatMap((section) => [
      '',
      section.title,
      ...section.items.map((item) => `- ${item}`),
    ]),
    ...report.chart.map((item) => `${item.label}: ${item.value}. ${item.detail}`),
  ];

  return lines.filter(Boolean).join('\n');
}

export function printReportPdf(report: VisualReport) {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer');
  if (!printWindow) return false;

  printWindow.document.write(`
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
          th, td { padding: 10px; border: 1px solid #d9e1de; text-align: left; vertical-align: top; }
          th { background: #e9f8ef; }
          ul { padding-left: 20px; }
          li { margin: 6px 0; }
          .advice { padding: 14px; background: #e9f8ef; border: 1px solid #b7e4c7; border-radius: 8px; }
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
            window.print();
          });
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
  return true;
}
