import { FeaturePanel } from '../components/FeaturePanel';
import { SectionHeader } from '../components/SectionHeader';

export function RentPage() {
  return (
    <main className="mobile-app-shell">
      <section className="section-page">
        <SectionHeader subtitle="Следи за объектами, сроками и важными условиями." title="Аренда" />
        <FeaturePanel
          title="Компоненты раздела"
          items={['Активные договоры', 'Календарь оплат', 'Заметки по объектам']}
        />
      </section>
    </main>
  );
}
