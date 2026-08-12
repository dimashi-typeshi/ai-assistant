import { Link, useLocation } from 'wouter';
import { RentOverviewCard } from '../components/RentOverviewCard';
import { SectionHeader } from '../components/SectionHeader';

const operations = [
  { id: 'op-1', title: 'Аренда офиса', amount: '420 000 ₸', status: 'Оплачено' },
  { id: 'op-2', title: 'Коммунальные услуги', amount: '38 500 ₸', status: 'В обработке' },
];

const pendingPayments = [
  { id: 'pay-1', title: 'Квартира на Абая', amount: '280 000 ₸', due: '20 августа 2026' },
  { id: 'pay-2', title: 'Интернет офиса', amount: '15 000 ₸', due: '25 августа 2026' },
];

const reminders = [
  { id: 'rem-1', title: 'Проверить оплату аренды', date: '19 августа 2026' },
  { id: 'rem-2', title: 'Отправить чек арендатору', date: '21 августа 2026' },
];

function PaymentsOverview() {
  return (
    <div className="rent-grid">
      <RentOverviewCard
        action="Открыть операции"
        detail="Последняя: Аренда офиса · 420 000 ₸"
        href="/payments/operations"
        summary={`${operations.length} операции`}
        title="Последние операции"
      />
      <RentOverviewCard
        action="Открыть платежи"
        detail="Ближайший: Квартира на Абая · 20 августа 2026"
        href="/payments/pending"
        summary={`${pendingPayments.length} ожидаются`}
        title="Ожидаемые платежи"
      />
      <RentOverviewCard
        action="Открыть напоминания"
        detail="Следующее: Проверить оплату аренды"
        href="/payments/reminders"
        summary={`${reminders.length} активных`}
        title="Напоминания"
      />
    </div>
  );
}

function OperationsPanel() {
  return (
    <>
      <form className="rent-form">
        <input placeholder="Название операции" />
        <div className="rent-form__row">
          <input placeholder="Сумма" type="number" />
          <input type="date" />
        </div>
        <button type="button">Добавить операцию</button>
      </form>
      <div className="rent-contract-list">
        {operations.map((item) => (
          <article className="rent-payment-row" key={item.id}>
            <span className="rent-payment-row__marker" />
            <div>
              <strong>{item.title}</strong>
              <p>{item.amount}</p>
            </div>
            <small>{item.status}</small>
          </article>
        ))}
      </div>
    </>
  );
}

function PendingPaymentsPanel() {
  return (
    <>
      <form className="rent-form">
        <input placeholder="За что платёж" />
        <div className="rent-form__row">
          <input placeholder="Сумма" type="number" />
          <input type="date" />
        </div>
        <button type="button">Добавить платёж</button>
      </form>
      <div className="rent-contract-list">
        {pendingPayments.map((item) => (
          <article className="rent-payment-row" key={item.id}>
            <span className="rent-payment-row__marker" />
            <div>
              <strong>{item.title}</strong>
              <p>{item.amount}</p>
            </div>
            <small>{item.due}</small>
          </article>
        ))}
      </div>
    </>
  );
}

function RemindersPanel() {
  return (
    <>
      <form className="rent-form">
        <input placeholder="Текст напоминания" />
        <input type="date" />
        <button type="button">Добавить напоминание</button>
      </form>
      <div className="rent-note-list">
        {reminders.map((item) => (
          <article className="rent-note-card" key={item.id}>
            <span className="rent-note-card__marker" />
            <div>
              <h2>{item.title}</h2>
              <small>{item.date}</small>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export function PaymentsPage() {
  const [location] = useLocation();
  const isSubpage = location !== '/payments';
  let content = <PaymentsOverview />;

  if (location === '/payments/operations') content = <OperationsPanel />;
  else if (location === '/payments/pending') content = <PendingPaymentsPanel />;
  else if (location === '/payments/reminders') content = <RemindersPanel />;

  return (
    <main className="mobile-app-shell">
      <section className="section-page">
        <div className="rent-header-row">
          <SectionHeader subtitle="Быстрый обзор платежей, статусов и напоминаний." title="Платежи" />
          {isSubpage && <Link className="rent-home-link" href="/payments">Назад</Link>}
        </div>
        {content}
      </section>
    </main>
  );
}
