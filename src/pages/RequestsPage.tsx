import { useEffect, useMemo, useState } from 'react';
import { Auth } from '../components/Auth';
import { RequestCard } from '../components/RequestCard';
import { RequestForm } from '../components/RequestForm';
import { RequestsCalendar } from '../components/RequestsCalendar';
import { RequestsDayList } from '../components/RequestsDayList';
import { SectionHeader } from '../components/SectionHeader';
import { TelegramImportForm } from '../components/TelegramImportForm';
import { RequestItem, RequestStatus, createNote, createRequest, deleteRequest, loadRequests, updateRequest } from '../lib/requests';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState('');

  const dayRequests = useMemo(
    () => requests.filter((request) => request.deadline_at?.slice(0, 10) === selectedDate),
    [requests, selectedDate],
  );
  const selectedRequest = requests.find((request) => request.id === selectedRequestId) ?? dayRequests[0];

  async function refresh() {
    const { data, error } = await loadRequests();
    if (error) setError(error.message);
    else setRequests((data ?? []) as RequestItem[]);
  }

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();
      setIsSignedIn(Boolean(data.session));
      setIsReady(true);
      if (data.session) await refresh();
    }
    if (isSupabaseConfigured) void init();
  }, []);

  async function run(action: () => Promise<{ error: Error | null }>) {
    setIsBusy(true);
    setError('');
    const result = await action();
    if (result.error) setError(result.error.message);
    else await refresh();
    setIsBusy(false);
  }

  async function add(title: string, deadlineAt: string | null, labelColor: string) {
    await run(() => createRequest(title, deadlineAt, labelColor));
  }

  async function importFromTelegram(title: string, deadlineAt: string | null, labelColor: string, details: string) {
    setIsBusy(true);
    setError('');
    const { data, error } = await createRequest(title, deadlineAt, labelColor);
    const createdId = data?.id;
    if (error) setError(error.message);
    else if (createdId && details) await createNote(createdId, `Импортировано из Telegram:\n${details}`);
    await refresh();
    setIsBusy(false);
  }

  async function change(id: string, status: RequestStatus, deadlineAt: string | null, labelColor: string) {
    await run(() => updateRequest(id, status, deadlineAt, labelColor));
  }

  async function remove(id: string) {
    await run(() => deleteRequest(id));
    setSelectedRequestId('');
  }

  return (
    <main className="mobile-app-shell">
      <section className="section-page requests-page">
        <SectionHeader subtitle="Импортируй заявки из Telegram, ставь дедлайны и отмечай цветом." title="Заявки" />
        {!isSupabaseConfigured && <p className="alert">Добавь Supabase URL и ключ в .env.</p>}
        {isSupabaseConfigured && isReady && !isSignedIn && <Auth />}
        {isSignedIn && (
          <>
            <TelegramImportForm disabled={isBusy} onCreate={importFromTelegram} />
            <RequestForm disabled={isBusy} onCreate={add} />
            {error && <p className="alert">{error}</p>}
            <RequestsCalendar requests={requests} selectedDate={selectedDate} onSelectDate={(date) => { setSelectedDate(date); setSelectedRequestId(''); }} />
            <RequestsDayList requests={dayRequests} selectedId={selectedRequest?.id ?? ''} onSelect={setSelectedRequestId} onUpdate={change} />
            {selectedRequest ? (
              <RequestCard key={selectedRequest.id} onDelete={remove} onUpdate={change} request={selectedRequest} />
            ) : (
              <p className="empty-state">Выбери дату с дедлайном или создай новую заявку.</p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
