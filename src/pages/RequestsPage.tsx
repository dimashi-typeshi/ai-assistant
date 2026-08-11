import { useEffect, useState } from 'react';
import { Auth } from '../components/Auth';
import { RequestCard } from '../components/RequestCard';
import { RequestForm } from '../components/RequestForm';
import { SectionHeader } from '../components/SectionHeader';
import { RequestItem, RequestStatus, createRequest, deleteRequest, loadRequests, updateRequest } from '../lib/requests';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState('');

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

  async function add(title: string, deadlineAt: string | null) {
    await run(() => createRequest(title, deadlineAt));
  }

  async function change(id: string, status: RequestStatus, deadlineAt: string | null) {
    await run(() => updateRequest(id, status, deadlineAt));
  }

  async function remove(id: string) {
    await run(() => deleteRequest(id));
  }

  return (
    <main className="mobile-app-shell">
      <section className="section-page requests-page">
        <SectionHeader subtitle="Создавай заявки, ставь дедлайны и веди историю записей." title="Заявки" />
        {!isSupabaseConfigured && <p className="alert">Добавь Supabase URL и ключ в .env.</p>}
        {isSupabaseConfigured && isReady && !isSignedIn && <Auth />}
        {isSignedIn && (
          <>
            <RequestForm disabled={isBusy} onCreate={add} />
            {error && <p className="alert">{error}</p>}
            <div className="requests-list">
              {requests.map((request) => (
                <RequestCard key={request.id} onDelete={remove} onUpdate={change} request={request} />
              ))}
              {requests.length === 0 && <p className="empty-state">Пока нет заявок. Создай первую выше.</p>}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
