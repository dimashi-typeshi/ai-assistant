import { useEffect, useMemo, useState } from 'react';
import { Auth } from '../components/Auth';
import { DemoActions } from '../components/DemoActions';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { RequestCard } from '../components/RequestCard';
import { RequestForm } from '../components/RequestForm';
import { RequestsCalendar } from '../components/RequestsCalendar';
import { RequestsDayList } from '../components/RequestsDayList';
import { SectionHeader } from '../components/SectionHeader';
import { TelegramImportForm } from '../components/TelegramImportForm';
import { RequestItem, RequestStatus, clearDemoRequests, createNote, createRequest, deleteRequest, loadRequests, seedDemoRequests, updateRequest } from '../lib/requests';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { friendlyError } from '../lib/uiMessages';

function todayKey() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
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
    if (error) setError(friendlyError(error.message));
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
    if (result.error) setError(friendlyError(result.error.message));
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
    if (error) setError(friendlyError(error.message));
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
        {isSupabaseConfigured && !isReady && <LoadingState text="Проверяем вход и загружаем заявки..." />}
        {isSupabaseConfigured && isReady && !isSignedIn && <Auth />}
        {isSignedIn && (
          <>
            <DemoActions disabled={isBusy} onClear={() => { void run(clearDemoRequests); setSelectedRequestId(''); }} onSeed={() => void run(seedDemoRequests)} />
            <TelegramImportForm disabled={isBusy} onCreate={importFromTelegram} />
            <RequestForm disabled={isBusy} onCreate={add} />
            {error && <p className="alert">{error}</p>}
            <RequestsCalendar requests={requests} selectedDate={selectedDate} onSelectDate={(date) => { setSelectedDate(date); setSelectedRequestId(''); }} />
            <RequestsDayList requests={dayRequests} selectedId={selectedRequest?.id ?? ''} onSelect={setSelectedRequestId} onUpdate={change} />
            {selectedRequest ? (
              <RequestCard key={selectedRequest.id} onDelete={remove} onUpdate={change} request={selectedRequest} />
            ) : (
              <EmptyState
                actionHref="/requests"
                actionLabel="Создать заявку"
                icon="+"
                text="Добавьте одну задачу с дедлайном. После этого календарь будет держать её на виду."
                title="Начните с одной заявки"
              />
            )}
          </>
        )}
      </section>
    </main>
  );
}
