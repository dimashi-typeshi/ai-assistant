import { useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';
import { AppTile } from '../components/AppTile';

const tiles = [
  { href: '/chat', icon: 'AI', label: 'Чат с ИИ', text: 'Идеи, тексты и ответы' },
  { href: '/ads', icon: 'AD', label: 'Создать рекламу', text: 'Баннер для Instagram' },
  { href: '/rent', icon: 'AR', label: 'Аренда', text: 'Сроки, суммы, объекты' },
  { href: '/payments', icon: '₸', label: 'Платежи', text: 'Оплаты и напоминания' },
  { href: '/requests', icon: '→', label: 'Заявки', text: 'Задачи и обращения' },
  { href: '/profile', icon: 'ID', label: 'Профиль', text: 'Данные и настройки' },
];

const searchItems = [
  ...tiles.map((tile) => ({ ...tile, section: 'Раздел' })),
  { href: '/rent/contracts', label: 'Активные договоры', section: 'Аренда', text: 'Договоры аренды, сроки, арендаторы, сумма в месяц' },
  { href: '/rent/payments', label: 'Календарь оплат', section: 'Аренда', text: 'Платежи аренды, даты, просрочки, суммы' },
  { href: '/rent/notes', label: 'Заметки по объектам', section: 'Аренда', text: 'Заметки, объекты, важные условия' },
  { href: '/payments/operations', label: 'Последние операции', section: 'Платежи', text: 'История операций, статус, сумма' },
  { href: '/payments/pending', label: 'Ожидаемые платежи', section: 'Платежи', text: 'Предстоящие платежи, дата, сумма' },
  { href: '/payments/reminders', label: 'Напоминания', section: 'Платежи', text: 'Напоминания об оплате и важных датах' },
  { href: '/requests', label: 'Календарь заявок', section: 'Заявки', text: 'Дедлайны, задачи, обращения, Telegram' },
];

const profileTile = tiles.find((tile) => tile.href === '/profile') ?? tiles[tiles.length - 1];

export function HomePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const cleanQuery = query.trim().toLowerCase();
  const dashboardTiles = tiles.filter((tile) => tile.href !== '/profile');
  const filteredTiles = useMemo(() => {
    if (!cleanQuery) return dashboardTiles;
    return dashboardTiles.filter((tile) => `${tile.label} ${tile.text}`.toLowerCase().includes(cleanQuery));
  }, [cleanQuery, dashboardTiles]);
  const searchResults = useMemo(() => {
    if (!cleanQuery) return [];
    return searchItems.filter((item) => (
      `${item.section} ${item.label} ${item.text}`.toLowerCase().includes(cleanQuery)
    ));
  }, [cleanQuery]);

  function openSearch() {
    setIsSearchOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <main className="mobile-app-shell home-dashboard-shell">
      <nav className="home-topbar">
        <Link className="home-ai-mark" href="/chat" aria-label="Открыть чат с ИИ">
          <span>AI</span>
        </Link>
        <div className="home-crumbs">
          <strong>dimashi-typeshi's Project</strong>
          <span>/</span>
          <b>main</b>
          <em>PRODUCTION</em>
        </div>
        <div className="home-actions">
          <button aria-label="Открыть поиск" className="home-search-button" onClick={openSearch} type="button">
            <span aria-hidden="true" />
          </button>
          <div className={`home-search${isSearchOpen ? ' home-search--open' : ''}`}>
            <input
              ref={inputRef}
              aria-label="Поиск по разделам"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
              value={query}
            />
          </div>
          <Link className="home-profile-link" href={profileTile.href} aria-label="Открыть профиль">
            <span>{profileTile.icon}</span>
            <strong>{profileTile.label}</strong>
          </Link>
        </div>
      </nav>

      <aside className="home-rail" aria-label="Быстрая навигация">
        {dashboardTiles.map((tile) => (
          <Link className="home-rail-link" href={tile.href} key={tile.href}>
            {tile.icon}
          </Link>
        ))}
      </aside>

      <section className="mobile-home">
        <header className="mobile-home__header">
          <div className="home-title-block">
            <p className="eyebrow">AI workspace</p>
            <h1>Панель управления</h1>
            <p>Быстрый доступ к рабочим разделам, платежам, аренде и заявкам.</p>
          </div>
        </header>

        {searchResults.length > 0 && (
          <div className="home-search-results">
            {searchResults.map((item) => (
              <Link className="home-search-result" href={item.href} key={`${item.section}-${item.href}`}>
                <span>{item.section}</span>
                <strong>{item.label}</strong>
                <p>{item.text}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="tile-grid">
          {filteredTiles.map((tile) => (
            <AppTile key={tile.href} {...tile} />
          ))}
        </div>
        {cleanQuery && searchResults.length === 0 && (
          <p className="empty-state">Ничего не найдено. Попробуй другой запрос.</p>
        )}
      </section>
    </main>
  );
}
