import type { ReportFormat, VisualReport } from './ReportsPanel';

type ReportOutputProps = {
  format: ReportFormat;
  report: VisualReport;
};

function getChartTotal(report: VisualReport) {
  return report.chart.reduce((sum, item) => sum + item.value, 0) || 1;
}

function getPieBackground(report: VisualReport) {
  const colors = ['#3ee58f', '#60a5fa', '#f59e0b', '#f472b6', '#a78bfa'];
  const total = getChartTotal(report);
  let start = 0;
  const parts = report.chart.map((item, index) => {
    const end = start + (item.value / total) * 100;
    const part = `${colors[index % colors.length]} ${start}% ${end}%`;
    start = end;
    return part;
  });
  return `conic-gradient(${parts.join(', ')})`;
}

export function ReportOutput({ format, report }: ReportOutputProps) {
  let content: JSX.Element;

  if (format === 'table') {
    content = (
      <div className="reports-table-wrap">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Раздел</th>
              <th>Факт</th>
              <th>Статус</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {report.rows.map((row) => (
              <tr key={`${row.source}-${row.fact}`}>
                <td>{row.source}</td>
                <td>{row.fact}</td>
                <td>{row.status}</td>
                <td>{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else if (format === 'matrix') {
    content = (
      <div className="reports-matrix">
        {report.rows.map((row) => (
          <article className="reports-matrix-card" key={`${row.source}-${row.fact}`}>
            <strong>{row.source}</strong>
            <span>{row.fact}</span>
            <span>{row.status}</span>
            <span>{row.action}</span>
          </article>
        ))}
      </div>
    );
  } else if (format === 'bar') {
    const max = Math.max(...report.chart.map((item) => item.value), 1);
    content = (
      <div className="reports-bars">
        {report.chart.map((item) => (
          <button className="reports-bar" key={item.label} title={item.detail} type="button">
            <span>{item.label}</span>
            <i style={{ width: `${Math.max(8, (item.value / max) * 100)}%` }} />
            <b>{item.value}</b>
          </button>
        ))}
      </div>
    );
  } else if (format === 'pie') {
    const total = getChartTotal(report);
    content = (
      <div className="reports-pie-layout">
        <div className="reports-pie" style={{ background: getPieBackground(report) }} aria-label={report.title} />
        <div className="reports-pie-list">
          {report.chart.map((item) => (
            <button key={item.label} title={item.detail} type="button">
              <span>{item.label}</span>
              <strong>{Math.round((item.value / total) * 100)}%</strong>
            </button>
          ))}
        </div>
      </div>
    );
  } else {
    content = (
      <div className="reports-list-output">
        {report.sections.map((section) => (
          <article key={section.title}>
            <h3>{section.title}</h3>
            <ul>
              {section.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>
    );
  }

  return (
    <>
      {content}
      <aside className="reports-advice">
        <strong>Совет ИИ</strong>
        <p>{report.advice}</p>
      </aside>
    </>
  );
}
