import { RequestItem, RequestStatus } from '../lib/requests';
import { DeadlineBadge, getDeadlineState } from './DeadlineBadge';

type RequestsDayListProps = {
  requests: RequestItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  onUpdate: (id: string, status: RequestStatus, deadlineAt: string | null) => Promise<void>;
};

function statusLabel(status: RequestStatus) {
  if (status === 'in_progress') return 'В работе';
  if (status === 'done') return 'Готово';
  return 'Новая';
}

export function RequestsDayList({ requests, selectedId, onSelect, onUpdate }: RequestsDayListProps) {
  if (requests.length === 0) return <p className="empty-state">На выбранную дату заявок нет.</p>;

  return (
    <section className="day-list">
      <h2>Заявки на день</h2>
      {requests.map((request) => {
        const state = getDeadlineState(request);
        return (
          <article className={`day-request day-request--${request.status}${state === 'overdue' ? ' day-request--overdue' : ''}`} key={request.id}>
            <button className={selectedId === request.id ? 'day-request__main active' : 'day-request__main'} onClick={() => onSelect(request.id)} type="button">
              <span>{request.title}</span>
              <small>{request.deadline_at ? new Date(request.deadline_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : 'Без времени'}</small>
              <em>{statusLabel(request.status)}</em>
            </button>
            <DeadlineBadge request={request} />
            {request.status === 'new' && (
              <button className="start-button" onClick={() => void onUpdate(request.id, 'in_progress', request.deadline_at)} type="button">
                Начать выполнение
              </button>
            )}
          </article>
        );
      })}
    </section>
  );
}
