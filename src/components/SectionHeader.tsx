import { Link } from 'wouter';

type SectionHeaderProps = {
  title: string;
  subtitle: string;
};

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <header className="section-header">
      <Link className="back-link" href="/#tabs">
        Назад
      </Link>
      <div>
        <p className="eyebrow">Раздел</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </header>
  );
}
