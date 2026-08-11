import { FeaturePanel } from '../components/FeaturePanel';
import { SectionHeader } from '../components/SectionHeader';

export function PaymentsPage() {
  return (
    <main className="mobile-app-shell">
      <section className="section-page">
        <SectionHeader subtitle="Быстрый обзор платежей, статусов и напоминаний." title="Платежи" />
        <FeaturePanel
          title="Компоненты раздела"
          items={['Последние операции', 'Ожидаемые платежи', 'Напоминания']}
        />
      </section>
    </main>
  );
}
