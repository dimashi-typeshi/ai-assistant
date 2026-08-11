import { RequestItem } from '../lib/requests';

export function getDeadlineState(request: RequestItem) {
  if (!request.deadline_at || request.status === 'done') return 'none';
  const diffMs = new Date(request.deadline_at).getTime() - Date.now();
  if (diffMs < 0) return 'overdue';
  if (diffMs <= 60 * 60 * 1000) return 'one-hour';
  if (diffMs <= 24 * 60 * 60 * 1000) return 'day';
  return 'none';
}

export function DeadlineBadge({ request }: { request: RequestItem }) {
  const state = getDeadlineState(request);
  if (state === 'overdue') return <span className="deadline-badge deadline-badge--danger">Просрочено</span>;
  if (state === 'one-hour') return <span className="deadline-badge deadline-badge--hot">Меньше 1 часа</span>;
  if (state === 'day') return <span className="deadline-badge">Скоро дедлайн</span>;
  return null;
}
