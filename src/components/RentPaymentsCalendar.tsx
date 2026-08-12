import { useMemo, useState } from 'react';
import { RentPaymentForm } from './RentPaymentForm';
import { formatRentAmount, formatRentDate, RentPayment } from '../lib/rent';

type RentPaymentsCalendarProps = {
  disabled: boolean;
  onCreate: (objectName: string, dueAt: string, amount: number) => Promise<void>;
  payments: RentPayment[];
};

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function todayKey() {
  return toDateKey(new Date());
}

function getMonthDays() {
  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth(), 1);
  const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const offset = (first.getDay() + 6) % 7;
  const days: (Date | null)[] = Array.from({ length: offset }, () => null);

  for (let day = 1; day <= last.getDate(); day += 1) {
    days.push(new Date(today.getFullYear(), today.getMonth(), day));
  }

  return days;
}

function isOverdue(payment: RentPayment) {
  return !payment.isPaid && payment.dueAt < todayKey();
}

export function RentPaymentsCalendar({ disabled, onCreate, payments }: RentPaymentsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const monthTitle = new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  const monthDays = useMemo(() => getMonthDays(), []);
  const selectedPayments = payments.filter((payment) => payment.dueAt === selectedDate);
  const plannedCount = payments.filter((payment) => !payment.isPaid).length;

  return (
    <>
      <RentPaymentForm disabled={disabled} onCreate={onCreate} />
      <section className="calendar-panel">
        <div className="calendar-header">
          <h2>{monthTitle}</h2>
          <span>{plannedCount} оплат</span>
        </div>
        <div className="calendar-weekdays">
          {weekDays.map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className="calendar-grid">
          {monthDays.map((date, index) => {
            if (!date) return <span className="calendar-day calendar-day--empty" key={`empty-${index}`} />;
            const dateKey = toDateKey(date);
            const dayPayments = payments.filter((payment) => payment.dueAt === dateKey);
            const hasOverdue = dayPayments.some(isOverdue);
            const isSelected = selectedDate === dateKey;

            return (
              <button
                className={`calendar-day${isSelected ? ' calendar-day--selected' : ''}${hasOverdue ? ' calendar-day--overdue' : ''}`}
                key={dateKey}
                onClick={() => setSelectedDate(dateKey)}
                type="button"
              >
                <span>{date.getDate()}</span>
                {dayPayments.length > 0 && <strong>{dayPayments.length}</strong>}
              </button>
            );
          })}
        </div>
      </section>

      <section className="day-list">
        <h2>{formatRentDate(selectedDate)}</h2>
        {selectedPayments.length > 0 ? (
          selectedPayments.map((payment) => (
            <article className={`rent-payment-row${isOverdue(payment) ? ' rent-payment-row--overdue' : ''}`} key={payment.id}>
              <span className="rent-payment-row__marker" />
              <div>
                <strong>{payment.objectName}</strong>
                <p>{formatRentAmount(payment.amount)}</p>
              </div>
              <small>{payment.isPaid ? 'Оплачено' : 'Ожидает оплаты'}</small>
            </article>
          ))
        ) : (
          <p className="empty-state">На эту дату оплат пока нет. Добавьте первый платёж аренды.</p>
        )}
      </section>
    </>
  );
}
