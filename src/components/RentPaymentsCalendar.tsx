import { useMemo, useState } from 'react';
import { EmptyState } from './EmptyState';
import { PhotoUpload } from './PhotoUpload';
import { RentPaymentForm } from './RentPaymentForm';
import { formatRentAmount, formatRentDate, RentPayment } from '../lib/rent';

type RentPaymentsCalendarProps = {
  disabled: boolean;
  onCreate: (objectName: string, dueAt: string, amount: number) => Promise<void>;
  payments: RentPayment[];
};

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function todayKey() {
  return toDateKey(new Date());
}

function getMonthDays(monthDate: Date) {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const last = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const offset = (first.getDay() + 6) % 7;
  const days: (Date | null)[] = Array.from({ length: offset }, () => null);

  for (let day = 1; day <= last.getDate(); day += 1) {
    days.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), day));
  }

  return days;
}

function isOverdue(payment: RentPayment) {
  return !payment.isPaid && payment.dueAt < todayKey();
}

export function RentPaymentsCalendar({ disabled, onCreate, payments }: RentPaymentsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const monthTitle = visibleMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  const monthDays = useMemo(() => getMonthDays(visibleMonth), [visibleMonth]);
  const selectedPayments = payments.filter((payment) => payment.dueAt === selectedDate);
  const monthPayments = payments.filter((payment) => {
    const dueDate = new Date(`${payment.dueAt}T00:00:00`);
    return dueDate.getFullYear() === visibleMonth.getFullYear() && dueDate.getMonth() === visibleMonth.getMonth();
  });

  function changeMonth(offset: number) {
    setVisibleMonth((current) => {
      const next = new Date(current.getFullYear(), current.getMonth() + offset, 1);
      setSelectedDate(toDateKey(next));
      return next;
    });
  }

  function returnToday() {
    const today = new Date();
    setVisibleMonth(today);
    setSelectedDate(todayKey());
  }

  return (
    <>
      <PhotoUpload disabled={disabled} section="rent-payments" title="Фото платежей аренды" />
      <RentPaymentForm disabled={disabled} onCreate={onCreate} />
      <section className="calendar-panel">
        <div className="calendar-header">
          <div>
            <h2>{monthTitle}</h2>
            <span>{monthPayments.length} оплат</span>
          </div>
          <div className="calendar-nav">
            <button aria-label="Предыдущий месяц" onClick={() => changeMonth(-1)} type="button">‹</button>
            <button onClick={returnToday} type="button">Сегодня</button>
            <button aria-label="Следующий месяц" onClick={() => changeMonth(1)} type="button">›</button>
          </div>
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
          <EmptyState
            icon="₸"
            text="На выбранный день оплат нет. Добавьте платёж выше, если хотите сохранить дату."
            title="На эту дату оплат нет"
          />
        )}
      </section>
    </>
  );
}
