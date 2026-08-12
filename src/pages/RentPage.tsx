import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Auth } from '../components/Auth';
import { RentContractsPanel } from '../components/RentContractsPanel';
import { RentNotesPanel } from '../components/RentNotesPanel';
import { RentOverviewCard } from '../components/RentOverviewCard';
import { RentPaymentsCalendar } from '../components/RentPaymentsCalendar';
import { SectionHeader } from '../components/SectionHeader';
import {
  createRentContract,
  createRentNote,
  createRentPayment,
  formatRentAmount,
  formatRentDate,
  loadRentContracts,
  loadRentNotes,
  loadRentPayments,
  mapRentContract,
  mapRentNote,
  mapRentPayment,
  RentContract,
  RentContractRow,
  RentNote,
  RentNoteRow,
  RentPayment,
  RentPaymentRow,
  sampleRentContracts,
  sampleRentNotes,
  sampleRentPayments,
} from '../lib/rent';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

function getContractsSummary(contracts: RentContract[]) {
  const active = contracts.filter((contract) => contract.isActive);
  const nearestEnd = active
    .map((contract) => contract.endsAt)
    .sort((first, second) => new Date(first).getTime() - new Date(second).getTime())[0];

  return {
    detail: nearestEnd ? `Ближайшее окончание: ${formatRentDate(nearestEnd)}` : 'Добавьте первый договор аренды.',
    summary: `${active.length} активных договоров`,
  };
}

function getPaymentsSummary(payments: RentPayment[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const unpaid = payments.filter((payment) => !payment.isPaid);
  const overdue = unpaid.find((payment) => new Date(payment.dueAt) < today);
  const next = unpaid
    .filter((payment) => new Date(payment.dueAt) >= today)
    .sort((first, second) => new Date(first.dueAt).getTime() - new Date(second.dueAt).getTime())[0];
  const payment = overdue ?? next;

  if (!payment) {
    return {
      detail: 'Добавьте первую оплату, чтобы видеть ближайший срок.',
      isWarning: false,
      summary: 'Нет запланированных оплат',
    };
  }

  return {
    detail: `${formatRentDate(payment.dueAt)} · ${formatRentAmount(payment.amount)} · ${payment.objectName}`,
    isWarning: Boolean(overdue),
    summary: overdue ? 'Есть просроченная оплата' : 'Ближайшая оплата',
  };
}

function getNotesSummary(notes: RentNote[]) {
  const latest = [...notes].sort(
    (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
  )[0];

  return {
    detail: latest ? `${latest.objectName}: ${latest.text}` : 'Добавьте первую заметку по объекту.',
    summary: `${notes.length} заметок`,
  };
}

export function RentPage() {
  const [location] = useLocation();
  const [contracts, setContracts] = useState<RentContract[]>([]);
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [notes, setNotes] = useState<RentNote[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState('');
  const isSubpage = location !== '/rent';
  const visibleContracts = contracts.length > 0 ? contracts : sampleRentContracts;
  const visiblePayments = payments.length > 0 ? payments : sampleRentPayments;
  const visibleNotes = notes.length > 0 ? notes : sampleRentNotes;
  const contractSummary = getContractsSummary(visibleContracts);
  const paymentSummary = getPaymentsSummary(visiblePayments);
  const noteSummary = getNotesSummary(visibleNotes);

  async function refreshRentData() {
    const [contractsResult, paymentsResult, notesResult] = await Promise.all([
      loadRentContracts(),
      loadRentPayments(),
      loadRentNotes(),
    ]);

    if (contractsResult.error) setError(contractsResult.error.message);
    else setContracts(((contractsResult.data ?? []) as RentContractRow[]).map(mapRentContract));

    if (paymentsResult.error) setError(paymentsResult.error.message);
    else setPayments(((paymentsResult.data ?? []) as RentPaymentRow[]).map(mapRentPayment));

    if (notesResult.error) setError(notesResult.error.message);
    else setNotes(((notesResult.data ?? []) as RentNoteRow[]).map(mapRentNote));
  }

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();
      setIsSignedIn(Boolean(data.session));
      setIsReady(true);
      if (data.session) await refreshRentData();
    }

    if (isSupabaseConfigured) void init();
  }, []);

  async function run(action: () => Promise<{ error: Error | null }>) {
    setIsBusy(true);
    setError('');
    const result = await action();
    if (result.error) setError(result.error.message);
    else await refreshRentData();
    setIsBusy(false);
  }

  let content = (
    <div className="rent-grid">
      <RentOverviewCard action="Открыть договоры" detail={contractSummary.detail} href="/rent/contracts" summary={contractSummary.summary} title="Активные договоры" />
      <RentOverviewCard action="Открыть календарь" detail={paymentSummary.detail} href="/rent/payments" isWarning={paymentSummary.isWarning} summary={paymentSummary.summary} title="Календарь оплат" />
      <RentOverviewCard action="Открыть заметки" detail={noteSummary.detail} href="/rent/notes" summary={noteSummary.summary} title="Заметки по объектам" />
    </div>
  );

  if (location === '/rent/contracts') {
    content = <RentContractsPanel contracts={visibleContracts} disabled={isBusy} onCreate={(objectName, tenantName, startsAt, endsAt, monthlyAmount) => run(() => createRentContract(objectName, tenantName, startsAt, endsAt, monthlyAmount))} />;
  } else if (location === '/rent/payments') {
    content = <RentPaymentsCalendar disabled={isBusy} onCreate={(objectName, dueAt, amount) => run(() => createRentPayment(objectName, dueAt, amount))} payments={visiblePayments} />;
  } else if (location === '/rent/notes') {
    content = <RentNotesPanel disabled={isBusy} notes={visibleNotes} onCreate={(objectName, text) => run(() => createRentNote(objectName, text))} />;
  }

  return (
    <main className="mobile-app-shell">
      <section className="section-page">
        <div className="rent-header-row">
          <SectionHeader subtitle="Следи за объектами, сроками и важными условиями." title="Аренда" />
          {isSubpage && <Link className="rent-home-link" href="/rent">Главная</Link>}
        </div>
        {!isSupabaseConfigured && <p className="alert">Добавь Supabase URL и ключ в .env.</p>}
        {isSupabaseConfigured && isReady && !isSignedIn && (
          <Auth onAuthenticated={async () => { setIsSignedIn(true); await refreshRentData(); }} />
        )}
        {isSignedIn && (
          <>
            {error && <p className="alert">{error}</p>}
            {content}
          </>
        )}
      </section>
    </main>
  );
}
