import { Link } from 'wouter';
import { ReportsPanel } from '../components/ReportsPanel';
import { SectionHeader } from '../components/SectionHeader';

export function ReportsPage() {
  return (
    <main className="mobile-app-shell">
      <section className="section-page reports-page">
        <Link className="back-link" href="/">На главную</Link>
        <SectionHeader
          subtitle="Выбери вкладки, из которых ИИ возьмёт информацию. В отчёт попадут только отмеченные данные."
          title="Отчёты"
        />
        <ReportsPanel />
      </section>
    </main>
  );
}
