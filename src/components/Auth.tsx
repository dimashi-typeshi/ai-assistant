import { useState } from 'react';
import { useLocation } from 'wouter';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { friendlyError } from '../lib/uiMessages';
import { SupabaseSetupMessage } from './SupabaseSetupMessage';

type AuthProps = {
  onAuthenticated?: () => Promise<void> | void;
};

export function Auth({ onAuthenticated }: AuthProps) {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const isLoading = busy || googleBusy;

  if (!isSupabaseConfigured) return <SupabaseSetupMessage />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      const request =
        mode === 'signup'
          ? supabase.auth.signUp({
              email,
              password,
              options: { emailRedirectTo: `${window.location.origin}/dashboard` },
            })
          : supabase.auth.signInWithPassword({ email, password });
      const { data, error } = await request;

      if (error) {
        setMessage(friendlyError(error.message));
        return;
      }

      if (data.session) {
        await onAuthenticated?.();
        navigate('/dashboard');
        return;
      }

      setMessage('Готово! Проверь почту, если нужно подтвердить email.');
    } catch {
      setMessage('Что-то пошло не так. Попробуй ещё раз.');
    } finally {
      setBusy(false);
    }
  }

  async function signInWithGoogle() {
    setGoogleBusy(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setMessage(friendlyError(error.message));
      setGoogleBusy(false);
    }
  }

  return (
    <section className="card">
      <h2>{mode === 'signin' ? 'Вход' : 'Регистрация'}</h2>
      <button
        type="button"
        className="google-auth-button"
        disabled={isLoading}
        onClick={signInWithGoogle}
      >
        <svg className="google-auth-icon" viewBox="0 0 48 48" aria-hidden="true">
          <path
            fill="#fbbc05"
            d="M9.8 28.9A15.1 15.1 0 0 1 9 24c0-1.7.3-3.3.8-4.9L3.3 14A23.9 23.9 0 0 0 1 24c0 3.6.8 7 2.3 10l6.5-5.1Z"
          />
          <path
            fill="#ea4335"
            d="M24 9.5c3.7 0 6.3 1.6 7.9 3l5.8-5.8C34.1 3.4 29.5 1.5 24 1.5A22.8 22.8 0 0 0 3.3 14l6.5 5.1A14.7 14.7 0 0 1 24 9.5Z"
          />
          <path
            fill="#34a853"
            d="M24 46.5c5.4 0 10-1.8 13.4-5l-6.2-4.8c-1.7 1.1-4 1.9-7.2 1.9a14.7 14.7 0 0 1-14.2-9.7L3.3 34A22.8 22.8 0 0 0 24 46.5Z"
          />
          <path
            fill="#4285f4"
            d="M46.1 24.5c0-1.6-.1-2.8-.4-4H24v8.3h12.7c-.6 3-2.2 6.1-5.5 7.9l6.2 4.8c3.6-3.4 8.7-8.5 8.7-17Z"
          />
        </svg>
        {googleBusy ? 'Открываем Google...' : 'Войти через Google'}
      </button>
      <div className="auth-divider">или</div>
      <form onSubmit={handleSubmit} className="form auth-form">
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
        <input
          type="password"
          placeholder="пароль (6+ символов)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          minLength={6}
          required
        />
        <button type="submit" disabled={isLoading}>
          {busy ? 'Загрузка...' : mode === 'signin' ? 'Войти' : 'Создать аккаунт'}
        </button>
      </form>
      {isLoading && <p className="message">Подожди, идёт запрос...</p>}
      {message && <p className="message">{message}</p>}
      <button
        className="ghost auth-switch-button"
        disabled={isLoading}
        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
      >
        {mode === 'signin' ? 'Нет аккаунта? Зарегистрируйся' : 'Уже есть аккаунт? Войти'}
      </button>
    </section>
  );
}
