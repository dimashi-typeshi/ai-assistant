import { RequestItem } from '../lib/requests';
import { getDeadlineState } from './DeadlineBadge';

type RequestsCalendarProps = {
  requests: RequestItem[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function sameDayRequests(requests: RequestItem[], dateKey: string) {
  return requests.filter((request) => request.deadline_at?.slice(0, 10) === dateKey);
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

export function RequestsCalendar({ requests, selectedDate, onSelectDate }: RequestsCalendarProps) {
  const title = new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

  return (
    <section className="calendar-panel">
      <div className="calendar-header">
        <h2>{title}</h2>
        <span>{requests.filter((request) => request.deadline_at).length} с дедлайном</span>
      </div>
      <div className="calendar-weekdays">
        {weekDays.map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="calendar-grid">
        {getMonthDays().map((date, index) => {
          if (!date) return <span className="calendar-day calendar-day--empty" key={`empty-${index}`} />;
          const dateKey = toDateKey(date);
          const dayRequests = sameDayRequests(requests, dateKey);
          const hasOverdue = dayRequests.some((request) => getDeadlineState(request) === 'overdue');
          const isSelected = selectedDate === dateKey;
          return (
            <button
              className={`calendar-day${isSelected ? ' calendar-day--selected' : ''}${hasOverdue ? ' calendar-day--overdue' : ''}`}
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              type="button"
            >
              <span>{date.getDate()}</span>
              {dayRequests.length > 0 && <strong>{dayRequests.length}</strong>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
