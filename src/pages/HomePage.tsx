import { AppTile } from '../components/AppTile';

const tiles = [
  { href: '/chat', icon: 'AI', label: 'Чат с ИИ', text: 'Идеи, тексты и ответы' },
  { href: '/rent', icon: 'AR', label: 'Аренда', text: 'Сроки, суммы, объекты' },
  { href: '/payments', icon: '₸', label: 'Платежи', text: 'Оплаты и напоминания' },
  { href: '/requests', icon: '→', label: 'Заявки', text: 'Задачи и обращения' },
  { href: '/profile', icon: 'ID', label: 'Профиль', text: 'Данные и настройки' },
];

export function HomePage() {
  return (
    <main className="mobile-app-shell">
      <section className="mobile-home">
        <header className="mobile-home__header">
          <div>
            <p className="eyebrow">AI workspace</p>
            <h1>Панель управления</h1>
          </div>
          <span className="status-pill">Online</span>
        </header>

        <div className="tile-grid">
          {tiles.map((tile) => (
            <AppTile key={tile.href} {...tile} />
          ))}
        </div>
      </section>
    </main>
  );
}
