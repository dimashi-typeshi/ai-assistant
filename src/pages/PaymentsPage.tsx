import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Auth } from '../components/Auth';
import { DemoActions } from '../components/DemoActions';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { PaymentForm } from '../components/PaymentForm';
import { PaymentsOverview } from '../components/PaymentsOverview';
import { PhotoUpload } from '../components/PhotoUpload';
import { SectionHeader } from '../components/SectionHeader';
import {
  clearDemoPayments,
  createPaymentOperation,
  createPaymentReminder,
  createPendingPayment,
  formatPaymentAmount,
  formatPaymentDate,
  loadPaymentOperations,
  loadPaymentReminders,
  loadPendingPayments,
  mapPaymentOperation,
  mapPaymentReminder,
  mapPendingPayment,
  PaymentOperation,
  PaymentOperationRow,
  PaymentReminder,
  PaymentReminderRow,
  PendingPayment,
  PendingPaymentRow,
  seedDemoPayments,
} from '../lib/payments';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { friendlyError } from '../lib/uiMessages';

export function PaymentsPage() {
  const [location] = useLocation();
  const [operations, setOperations] = useState<PaymentOperation[]>([]);
  const [pending, setPending] = useState<PendingPayment[]>([]);
  const [reminders, setReminders] = useState<PaymentReminder[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState('');
  const isSubpage = location !== '/payments';

  async function refresh() {
    const [operationsResult, pendingResult, remindersResult] = await Promise.all([
      loadPaymentOperations(),
      loadPendingPayments(),
      loadPaymentReminders(),
    ]);
    if (operationsResult.error) setError(friendlyError(operationsResult.error.message));
    else setOperations(((operationsResult.data ?? []) as PaymentOperationRow[]).map(mapPaymentOperation));
    if (pendingResult.error) setError(friendlyError(pendingResult.error.message));
    else setPending(((pendingResult.data ?? []) as PendingPaymentRow[]).map(mapPendingPayment));
    if (remindersResult.error) setError(friendlyError(remindersResult.error.message));
    else setReminders(((remindersResult.data ?? []) as PaymentReminderRow[]).map(mapPaymentReminder));
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

  let content = <PaymentsOverview operations={operations} pending={pending} reminders={reminders} />;
  if (location === '/payments/operations') {
    content = (
      <>
        <PhotoUpload disabled={isBusy} section="payment-operations" title="Фото операций" />
        <PaymentForm buttonLabel="Добавить операцию" dateLabel="Дата операции" disabled={isBusy} onCreate={(title, amount, date) => run(() => createPaymentOperation(title, amount, date))} titleLabel="Название операции" />
        {operations.length === 0 ? <EmptyState icon="₸" text="Запишите первую оплату: аренда, закупка, чек или перевод." title="Операций пока нет" /> : operations.map((item) => <article className="rent-payment-row" key={item.id}><span className="rent-payment-row__marker" /><div><strong>{item.title}</strong><p>{formatPaymentAmount(item.amount)}</p></div><small>{item.status}</small></article>)}
      </>
    );
  } else if (location === '/payments/pending') {
    content = (
      <>
        <PhotoUpload disabled={isBusy} section="pending-payments" title="Фото ожидаемых платежей" />
        <PaymentForm buttonLabel="Добавить платёж" dateLabel="Дата платежа" disabled={isBusy} onCreate={(title, amount, date) => run(() => createPendingPayment(title, amount, date))} titleLabel="За что платёж" />
        {pending.length === 0 ? <EmptyState icon="!" text="Добавьте платёж с датой, чтобы видеть ближайший срок." title="Ожидаемых платежей пока нет" /> : pending.map((item) => <article className="rent-payment-row" key={item.id}><span className="rent-payment-row__marker" /><div><strong>{item.title}</strong><p>{formatPaymentAmount(item.amount)}</p></div><small>{formatPaymentDate(item.dueAt)}</small></article>)}
      </>
    );
  } else if (location === '/payments/reminders') {
    content = (
      <>
        <PhotoUpload disabled={isBusy} section="payment-reminders" title="Фото для напоминаний" />
        <PaymentForm buttonLabel="Добавить напоминание" dateLabel="Дата напоминания" disabled={isBusy} hideAmount onCreate={(title, _amount, date) => run(() => createPaymentReminder(title, date))} titleLabel="Текст напоминания" />
        {reminders.length === 0 ? <EmptyState icon="✓" text="Добавьте дату проверки оплаты, отправки чека или важного звонка." title="Напоминаний пока нет" /> : reminders.map((item) => <article className="rent-note-card" key={item.id}><span className="rent-note-card__marker" /><div><h2>{item.title}</h2><small>{formatPaymentDate(item.remindAt)}</small></div></article>)}
      </>
    );
  }

  return (
    <main className="mobile-app-shell">
      <section className="section-page">
        <div className="rent-header-row">
          <SectionHeader subtitle="Быстрый обзор платежей, статусов и напоминаний." title="Платежи" />
          {isSubpage && <Link className="rent-home-link" href="/payments">Назад</Link>}
        </div>
        {!isSupabaseConfigured && <p className="alert">Добавь Supabase URL и ключ в .env.</p>}
        {isSupabaseConfigured && !isReady && <LoadingState text="Проверяем вход и загружаем платежи..." />}
        {isSupabaseConfigured && isReady && !isSignedIn && <Auth onAuthenticated={async () => { setIsSignedIn(true); await refresh(); }} />}
        {isSignedIn && (
          <>
            {error && <p className="alert">{error}</p>}
            <DemoActions disabled={isBusy} onClear={() => void run(clearDemoPayments)} onSeed={() => void run(seedDemoPayments)} />
            {content}
          </>
        )}
      </section>
    </main>
  );
}
