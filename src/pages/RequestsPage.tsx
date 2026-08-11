import { FeaturePanel } from '../components/FeaturePanel';
import { SectionHeader } from '../components/SectionHeader';

export function RequestsPage() {
  return (
    <main className="mobile-app-shell">
      <section className="section-page">
        <SectionHeader subtitle="Собирай обращения, задачи и следующие шаги в одном месте." title="Заявки" />
        <FeaturePanel
          title="Компоненты раздела"
          items={['Новые заявки', 'В работе', 'История обращений']}
        />
      </section>
    </main>
  );
}
