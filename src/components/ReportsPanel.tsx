import { useState } from 'react';
import { ReportOutput } from './ReportOutput';
import { askBusinessAssistant } from '../lib/ai';
import {
  loadPaymentOperations,
  loadPaymentReminders,
  loadPendingPayments,
  mapPaymentOperation,
  mapPaymentReminder,
  mapPendingPayment,
  PaymentOperationRow,
  PaymentReminderRow,
  PendingPaymentRow,
} from '../lib/payments';
import {
  loadRentContracts,
  loadRentNotes,
  loadRentPayments,
  mapRentContract,
  mapRentNote,
  mapRentPayment,
  RentContractRow,
  RentNoteRow,
  RentPaymentRow,
} from '../lib/rent';
import { loadRequests, RequestItem } from '../lib/requests';
import { isSupabaseConfigured } from '../lib/supabase';

type SourceId = 'requests' | 'contracts' | 'payments' | 'notes';
export type ReportFormat = 'table' | 'list' | 'matrix' | 'bar' | 'pie';
export type VisualReport = {
  advice: string;
  title: string;
  rows: { source: string; fact: string; status: string; action: string }[];
  sections: { title: string; items: string[] }[];
  chart: { label: string; value: number; detail: string }[];
};

const sources: { id: SourceId; label: string; text: string }[] = [
  { id: 'requests', label: 'Заявки', text: 'Информация из вкладки заявок' },
  { id: 'contracts', label: 'Аренда: договоры', text: 'Активные договоры и объекты' },
  { id: 'payments', label: 'Платежи', text: 'Оплаты, суммы и ближайшие даты' },
  { id: 'notes', label: 'Аренда: заметки', text: 'Заметки по объектам' },
];

const formats: { id: ReportFormat; label: string; instruction: string }[] = [
  { id: 'table', label: 'Табличный', instruction: 'Заполни rows для таблицы.' },
  { id: 'list', label: 'Списочный', instruction: 'Заполни sections для карточек списка.' },
  { id: 'matrix', label: 'Шахматка', instruction: 'Заполни rows для матрицы источников.' },
  { id: 'bar', label: 'Диаграмма', instruction: 'Заполни chart числовыми значениями для столбчатой диаграммы.' },
  { id: 'pie', label: 'Pie chart', instruction: 'Заполни chart числовыми долями для круговой диаграммы.' },
];

function toggleValue(values: SourceId[], value: SourceId) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function parseVisualReport(value: string): VisualReport {
  const cleanValue = value.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  const parsed = JSON.parse(cleanValue) as Partial<VisualReport>;
  return {
    advice: typeof parsed.advice === 'string' ? parsed.advice : 'Проверь самый срочный пункт и назначь ответственного.',
    chart: Array.isArray(parsed.chart) ? parsed.chart : [],
    rows: Array.isArray(parsed.rows) ? parsed.rows : [],
    sections: Array.isArray(parsed.sections) ? parsed.sections : [],
    title: typeof parsed.title === 'string' ? parsed.title : 'AI отчёт',
  };
}

async function collectReportData(selected: SourceId[]) {
  const chunks: string[] = [];

  if (selected.includes('requests')) {
    const { data, error } = await loadRequests();
    if (error) throw new Error(error.message);
    chunks.push(`Заявки:\n${JSON.stringify((data ?? []) as RequestItem[], null, 2)}`);
  }

  if (selected.includes('contracts')) {
    const { data, error } = await loadRentContracts();
    if (error) throw new Error(error.message);
    chunks.push(`Договоры:\n${JSON.stringify(((data ?? []) as RentContractRow[]).map(mapRentContract), null, 2)}`);
  }

  if (selected.includes('payments')) {
    const [rentResult, operationsResult, pendingResult, remindersResult] = await Promise.all([
      loadRentPayments(),
      loadPaymentOperations(),
      loadPendingPayments(),
      loadPaymentReminders(),
    ]);
    if (rentResult.error) throw new Error(rentResult.error.message);
    if (operationsResult.error) throw new Error(operationsResult.error.message);
    if (pendingResult.error) throw new Error(pendingResult.error.message);
    if (remindersResult.error) throw new Error(remindersResult.error.message);
    chunks.push(`Платежи:\n${JSON.stringify({
      operations: ((operationsResult.data ?? []) as PaymentOperationRow[]).map(mapPaymentOperation),
      pending: ((pendingResult.data ?? []) as PendingPaymentRow[]).map(mapPendingPayment),
      reminders: ((remindersResult.data ?? []) as PaymentReminderRow[]).map(mapPaymentReminder),
      rent: ((rentResult.data ?? []) as RentPaymentRow[]).map(mapRentPayment),
    }, null, 2)}`);
  }

  if (selected.includes('notes')) {
    const { data, error } = await loadRentNotes();
    if (error) throw new Error(error.message);
    chunks.push(`Заметки:\n${JSON.stringify(((data ?? []) as RentNoteRow[]).map(mapRentNote), null, 2)}`);
  }

  return chunks.join('\n\n');
}

export function ReportsPanel() {
  const [selected, setSelected] = useState<SourceId[]>(['requests', 'payments']);
  const [format, setFormat] = useState<ReportFormat>('table');
  const [report, setReport] = useState<VisualReport | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function generateReport() {
    if (selected.length === 0 || isLoading) return;
    setError('');
    setReport(null);
    setIsLoading(true);

    try {
      if (!isSupabaseConfigured) throw new Error('Сначала добавь Supabase URL и ключ в .env.');
      const reportData = await collectReportData(selected);
      const formatInstruction = formats.find((item) => item.id === format)?.instruction ?? formats[0].instruction;
      const prompt = [
        'Сформируй визуальный бизнес-отчёт на русском языке только по выбранным вкладкам.',
        'Не добавляй данные из вкладок, которые пользователь не отметил.',
        'Пиши коротко и простыми словами.',
        'Верни только валидный JSON без markdown и пояснений.',
        'Формат JSON: {"title":"...","advice":"один короткий совет до 140 символов","rows":[{"source":"...","fact":"...","status":"...","action":"..."}],"sections":[{"title":"...","items":["..."]}],"chart":[{"label":"...","value":1,"detail":"..."}]}.',
        formatInstruction,
        reportData || 'В выбранных вкладках нет записей.',
      ].join('\n\n');
      setReport(parseVisualReport(await askBusinessAssistant(prompt)));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Не получилось сформировать отчёт.');
    } finally {
      setIsLoading(false);
    }
  }

  function downloadReport() {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ai-report.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="reports-panel">
      <div className="reports-source-list">
        {sources.map((source) => (
          <label className="reports-source" key={source.id}>
            <input checked={selected.includes(source.id)} onChange={() => setSelected(toggleValue(selected, source.id))} type="checkbox" />
            <span><strong>{source.label}</strong><small>{source.text}</small></span>
          </label>
        ))}
      </div>
      <div className="reports-format-list" aria-label="Формат отчёта">
        {formats.map((item) => (
          <button
            className={format === item.id ? 'reports-format reports-format--active' : 'reports-format'}
            key={item.id}
            onClick={() => setFormat(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <button className="reports-generate-button" disabled={selected.length === 0 || isLoading} onClick={() => void generateReport()} type="button">
        {isLoading ? 'Генерируется...' : 'Сгенерировать'}
      </button>
      {error && <p className="alert">{error}</p>}
      {report && <ReportOutput format={format} report={report} />}
      {report && <button className="reports-download-button" onClick={downloadReport} type="button">Скачать отчёт</button>}
    </section>
  );
}
