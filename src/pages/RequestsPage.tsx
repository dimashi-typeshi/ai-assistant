import { useEffect, useMemo, useState } from 'react';
import { RequestCard } from '../components/RequestCard';
import { RequestForm } from '../components/RequestForm';
import { RequestsCalendar } from '../components/RequestsCalendar';
import { RequestsDayList } from '../components/RequestsDayList';
import { SectionHeader } from '../components/SectionHeader';
import { RequestItem, RequestStatus, createRequest, deleteRequest, loadRequests, updateRequest } from '../lib/requests';
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
      if (!data.session) {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) {
          setError('Не удалось открыть заявки без входа. Включи Anonymous sign-ins в Supabase Auth.');
          setIsReady(true);
          return;
        }
      }
      await refresh();
      setIsReady(true);
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

  async function add(title: string, deadlineAt: string | null) {
    await run(() => createRequest(title, deadlineAt));
  }

  async function change(id: string, status: RequestStatus, deadlineAt: string | null) {
    await run(() => updateRequest(id, status, deadlineAt));
  }

  async function remove(id: string) {
    await run(() => deleteRequest(id));
    setSelectedRequestId('');
  }

  return (
    <main className="mobile-app-shell">
      <section className="section-page requests-page">
        <SectionHeader subtitle="Смотри дедлайны в календаре и быстро переходи к выполнению." title="Заявки" />
        {!isSupabaseConfigured && <p className="alert">Добавь Supabase URL и ключ в .env.</p>}
        {error && <p className="alert">{error}</p>}
        {isSupabaseConfigured && isReady && !error && (
          <>
            <RequestForm disabled={isBusy} onCreate={add} />
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
