import { useState } from 'react';
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

export function RequestsCalendar({ requests, selectedDate, onSelectDate }: RequestsCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(selectedDate));
  const title = visibleMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  const monthRequests = requests.filter((request) => {
    const deadline = request.deadline_at ? new Date(request.deadline_at) : null;
    return deadline?.getFullYear() === visibleMonth.getFullYear() && deadline.getMonth() === visibleMonth.getMonth();
  });

  function changeMonth(offset: number) {
    setVisibleMonth((current) => {
      const next = new Date(current.getFullYear(), current.getMonth() + offset, 1);
      onSelectDate(toDateKey(next));
      return next;
    });
  }

  function returnToday() {
    const today = new Date();
    setVisibleMonth(today);
    onSelectDate(todayKey());
  }

  return (
    <section className="calendar-panel">
      <div className="calendar-header">
        <div>
          <h2>{title}</h2>
          <span>{monthRequests.length} с дедлайном</span>
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
        {getMonthDays(visibleMonth).map((date, index) => {
          if (!date) return <span className="calendar-day calendar-day--empty" key={`empty-${index}`} />;
          const dateKey = toDateKey(date);
          const dayRequests = sameDayRequests(requests, dateKey);
          const colors = [...new Set(dayRequests.map((request) => request.label_color))].slice(0, 4);
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
              {colors.length > 0 && (
                <i className="calendar-color-row">
                  {colors.map((color) => <b key={color} style={{ backgroundColor: color }} />)}
                </i>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
