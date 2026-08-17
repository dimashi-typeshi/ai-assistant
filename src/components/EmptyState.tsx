import { Link } from 'wouter';

type EmptyStateProps = {
  actionHref?: string;
  actionLabel?: string;
  icon: string;
  text: string;
  title: string;
};

export function EmptyState({ actionHref, actionLabel, icon, text, title }: EmptyStateProps) {
  return (
    <section className="friendly-empty">
      <span aria-hidden="true">{icon}</span>
      <h2>{title}</h2>
      <p>{text}</p>
      {actionHref && actionLabel && <Link href={actionHref}>{actionLabel}</Link>}
    </section>
  );
}
