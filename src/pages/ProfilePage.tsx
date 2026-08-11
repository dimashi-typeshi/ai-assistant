import { FeaturePanel } from '../components/FeaturePanel';
import { SectionHeader } from '../components/SectionHeader';

export function ProfilePage() {
  return (
    <main className="mobile-app-shell">
      <section className="section-page">
        <SectionHeader subtitle="Настройки аккаунта, уведомления и данные проекта." title="Профиль" />
        <FeaturePanel
          title="Компоненты раздела"
          items={['Данные пользователя', 'Уведомления', 'Настройки приложения']}
        />
      </section>
    </main>
  );
}
