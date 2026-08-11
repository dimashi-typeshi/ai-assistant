import { useState } from 'react';
import { requestLabelColors } from '../lib/requestImport';
import { RequestItem, RequestStatus } from '../lib/requests';
import { DeadlineBadge, getDeadlineState } from './DeadlineBadge';
import { RequestNotes } from './RequestNotes';

type RequestCardProps = {
  request: RequestItem;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, status: RequestStatus, deadlineAt: string | null, labelColor: string) => Promise<void>;
};

function toInputValue(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export function RequestCard({ request, onDelete, onUpdate }: RequestCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const deadlineClass = getDeadlineState(request) === 'overdue' ? ' request-card--overdue' : '';

  async function changeStatus(status: RequestStatus) {
    await onUpdate(request.id, status, request.deadline_at, request.label_color);
  }

  async function changeDeadline(value: string) {
    await onUpdate(request.id, request.status, value ? new Date(value).toISOString() : null, request.label_color);
  }

  async function changeColor(labelColor: string) {
    await onUpdate(request.id, request.status, request.deadline_at, labelColor);
  }

  return (
    <article className={`request-card${deadlineClass}`} style={{ borderLeftColor: request.label_color }}>
      <div className="request-card__top">
        <div>
          <h2>{request.title}</h2>
          <p>Создано: {new Date(request.created_at).toLocaleDateString('ru-RU')}</p>
        </div>
        <DeadlineBadge request={request} />
      </div>

      {request.status === 'new' && <button className="primary-wide" onClick={() => void changeStatus('in_progress')} type="button">Начать выполнение</button>}

      <div className="request-fields">
        <label>
          Статус
          <select onChange={(event) => void changeStatus(event.target.value as RequestStatus)} value={request.status}>
            <option value="new">Новая</option>
            <option value="in_progress">В работе</option>
            <option value="done">Готово</option>
          </select>
        </label>
        <label>
          Дедлайн
          <input onChange={(event) => void changeDeadline(event.target.value)} type="datetime-local" value={toInputValue(request.deadline_at)} />
        </label>
      </div>

      <div className="color-picker color-picker--card" aria-label="Цветовая метка">
        {requestLabelColors.map((color) => (
          <button
            className={request.label_color === color ? 'color-dot color-dot--active' : 'color-dot'}
            key={color}
            onClick={() => void changeColor(color)}
            style={{ backgroundColor: color }}
            type="button"
          />
        ))}
      </div>

      <div className="request-actions">
        <button onClick={() => setIsOpen((current) => !current)} type="button">{isOpen ? 'Скрыть записи' : 'Записи'}</button>
        <button onClick={() => void onDelete(request.id)} type="button">Удалить</button>
      </div>

      {isOpen && <RequestNotes requestId={request.id} />}
    </article>
  );
}
