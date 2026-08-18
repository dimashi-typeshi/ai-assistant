import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { friendlyError } from '../lib/uiMessages';
import { LoadingState } from './LoadingState';
import { SupabaseSetupMessage } from './SupabaseSetupMessage';

// Пример работы с базой: читаем, добавляем и удаляем свои записи.
// Таблица `entries` создаётся миграцией в supabase/migrations/. Переделай это под свою идею:
// вопросы для квиза, привычки, места, карточки — что угодно.
type Entry = {
  id: string;
  title: string;
  created_at: string;
};

export function Entries({ userEmail }: { userEmail: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function load() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('entries')
      .select('id, title, created_at')
      .order('created_at', { ascending: false });
    if (error) setError(friendlyError(error.message));
    else setEntries(data ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    if (isSupabaseConfigured) void load();
  }, []);

  if (!isSupabaseConfigured) return <SupabaseSetupMessage />;

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const { error } = await supabase.from('entries').insert({ title: title.trim() });
    if (error) setError(friendlyError(error.message));
    else {
      setTitle('');
      load();
    }
  }

  async function remove(id: string) {
    const { error } = await supabase.from('entries').delete().eq('id', id);
    if (error) setError(friendlyError(error.message));
    else load();
  }

  return (
    <section className="card">
      <p className="hello">Привет, {userEmail} 👋</p>
      <h2>Мои записи</h2>

      <form onSubmit={add} className="form-row">
        <input
          placeholder="что добавить…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Добавить</button>
      </form>

      {error && <p className="message">{error}</p>}
      {isLoading && <LoadingState text="Загружаем записи..." />}

      {!isLoading && entries.length === 0 ? (
        <p className="empty">Пока пусто. Добавь первую запись 👆</p>
      ) : (
        <ul className="list">
          {entries.map((it) => (
            <li key={it.id}>
              <span>{it.title}</span>
              <button className="ghost small" onClick={() => remove(it.id)}>
                удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
