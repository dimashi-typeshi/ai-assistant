import { CSSProperties, useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';
import { AppTile } from '../components/AppTile';

const tiles = [
  { href: '/chat', icon: 'AI', label: 'Чат с ИИ', text: 'Идеи, тексты и ответы' },
  { href: '/ads', icon: 'AD', label: 'Создать рекламу', text: 'Баннер для Instagram' },
  { href: '/rent', icon: 'AR', label: 'Аренда', text: 'Сроки, суммы, объекты' },
  { href: '/payments', icon: '₸', label: 'Платежи', text: 'Оплаты и напоминания' },
  { href: '/requests', icon: '→', label: 'Заявки', text: 'Задачи и обращения' },
  { href: '/seats', icon: 'SE', label: 'Свободные места', text: 'Схема здания и отметки мест' },
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
  { href: '/seats', label: 'Свободные места', section: 'Схема здания', text: 'Фото схемы, распознавание ИИ, отметка свободных и занятых мест' },
];

const profileTile = tiles.find((tile) => tile.href === '/profile') ?? tiles[tiles.length - 1];
const neonColors = ['cyan', 'pink', 'lime', 'amber', 'violet', 'teal'];
const neonShapes = ['circle', 'diamond', 'capsule', 'soft-square', 'line'];

function createFloatingShapes() {
  return Array.from({ length: 12 }, (_, index) => {
    const size = Math.round(120 + Math.random() * 260);
    const color = neonColors[Math.floor(Math.random() * neonColors.length)];
    const shape = neonShapes[Math.floor(Math.random() * neonShapes.length)];

    return {
      color,
      id: `shape-${index}-${Math.random().toString(36).slice(2)}`,
      shape,
      style: {
        '--shape-delay': `${Math.random() * -8}s`,
        '--shape-duration': `${6 + Math.random() * 7}s`,
        '--shape-rotate': `${Math.round(Math.random() * 90 - 45)}deg`,
        '--shape-size': `${size}px`,
        left: `${Math.round(Math.random() * 88)}vw`,
        top: `${Math.round(10 + Math.random() * 82)}vh`,
      } as CSSProperties,
    };
  });
}

export function HomePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const floatingShapes = useMemo(() => createFloatingShapes(), []);
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
      <div className="floating-shapes" aria-hidden="true">
        {floatingShapes.map((shape) => (
          <span
            className={`floating-shape floating-shape--${shape.shape} floating-shape--${shape.color}`}
            key={shape.id}
            style={shape.style}
          />
        ))}
      </div>
      <nav className="home-topbar">
        <Link className="home-ai-mark" href="/chat" aria-label="Открыть чат с ИИ">
          <span>A</span>
        </Link>
        <div className="home-crumbs">
          <strong>AI Assistant</strong>
          <span>/</span>
          <b>Workspace</b>
          <em>LIVE</em>
        </div>
        <div className="home-actions">
          <button aria-label="Открыть поиск" className="home-search-button" onClick={openSearch} type="button">
            <span aria-hidden="true" />
          </button>
          <div className={`home-search${isSearchOpen ? ' home-search--open' : ''}`}>
            <input ref={inputRef} aria-label="Поиск по разделам" onChange={(event) => setQuery(event.target.value)} placeholder="Search..." value={query} />
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
            <span>{tile.icon}</span>
            <strong>{tile.label}</strong>
          </Link>
        ))}
      </aside>

      <section className="mobile-home">
        <section className="home-promo">
          <div className="home-promo__copy">
            <h1>
              Управляй бизнесом быстрее
              <span>с AI workspace</span>
            </h1>
            <p>Все ключевые инструменты в одном месте: ИИ-чат, реклама, аренда, платежи, заявки, свободные места и профиль команды.</p>
            <div className="home-promo__actions">
              <Link className="home-promo__primary" href="/chat">Начать с ИИ</Link>
              <Link className="home-promo__secondary" href="/seats">Открыть схему мест</Link>
            </div>
          </div>
          <div className="home-promo__stats">
            <article>
              <strong>AI</strong>
              <p>Генерация идей, текстов и анализ фото</p>
            </article>
            <article>
              <strong>₸</strong>
              <p>Платежи, статусы и напоминания</p>
            </article>
            <article>
              <strong>SE</strong>
              <p>Свободные места на схеме здания</p>
            </article>
          </div>
        </section>

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
