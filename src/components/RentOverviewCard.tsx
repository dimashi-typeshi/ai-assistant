import { Link } from 'wouter';

type RentOverviewCardProps = {
  title: string;
  href: string;
  summary: string;
  detail: string;
  action: string;
  isWarning?: boolean;
};

export function RentOverviewCard({
  title,
  href,
  summary,
  detail,
  action,
  isWarning = false,
}: RentOverviewCardProps) {
  return (
    <Link className={`rent-card${isWarning ? ' rent-card--warning' : ''}`} href={href}>
      <span className="rent-card__marker" />
      <div>
        <h2>{title}</h2>
        <strong>{summary}</strong>
        <p>{detail}</p>
      </div>
      <span className="rent-card__action">{action}</span>
    </Link>
  );
}
