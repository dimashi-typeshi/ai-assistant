import { RentOverviewCard } from './RentOverviewCard';
import { formatPaymentAmount, formatPaymentDate, PaymentOperation, PaymentReminder, PendingPayment } from '../lib/payments';

type PaymentsOverviewProps = {
  operations: PaymentOperation[];
  pending: PendingPayment[];
  reminders: PaymentReminder[];
};

export function PaymentsOverview({ operations, pending, reminders }: PaymentsOverviewProps) {
  const latest = operations[0];
  const nearest = pending[0];
  const nextReminder = reminders[0];

  return (
    <div className="rent-grid">
      <RentOverviewCard action="Открыть операции" detail={latest ? `${latest.title} · ${formatPaymentAmount(latest.amount)}` : 'Добавьте первую оплаченную операцию.'} href="/payments/operations" summary={`${operations.length} операций`} title="Последние операции" />
      <RentOverviewCard action="Открыть платежи" detail={nearest ? `${nearest.title} · ${formatPaymentDate(nearest.dueAt)}` : 'Добавьте ближайший платёж, чтобы не забыть срок.'} href="/payments/pending" summary={`${pending.length} ожидаются`} title="Ожидаемые платежи" />
      <RentOverviewCard action="Открыть напоминания" detail={nextReminder ? `${nextReminder.title} · ${formatPaymentDate(nextReminder.remindAt)}` : 'Добавьте важную дату или действие.'} href="/payments/reminders" summary={`${reminders.length} активных`} title="Напоминания" />
    </div>
  );
}
