import { useMemo, useRef, useState } from 'react';
import { AppTile } from '../components/AppTile';

const tiles = [
  { href: '/chat', icon: 'AI', label: 'Чат с ИИ', text: 'Идеи, тексты и ответы' },
  { href: '/ads', icon: 'AD', label: 'Создать рекламу', text: 'Баннер для Instagram' },
  { href: '/rent', icon: 'AR', label: 'Аренда', text: 'Сроки, суммы, объекты' },
  { href: '/payments', icon: '₸', label: 'Платежи', text: 'Оплаты и напоминания' },
  { href: '/requests', icon: '→', label: 'Заявки', text: 'Задачи и обращения' },
  { href: '/profile', icon: 'ID', label: 'Профиль', text: 'Данные и настройки' },
];

export function HomePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const filteredTiles = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return tiles;

    return tiles.filter((tile) => `${tile.label} ${tile.text}`.toLowerCase().includes(cleanQuery));
  }, [query]);

  function openSearch() {
    setIsSearchOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <main className="mobile-app-shell">
      <section className="mobile-home">
        <header className="mobile-home__header">
          <div>
            <p className="eyebrow">AI workspace</p>
            <h1>Панель управления</h1>
          </div>
          <button
            aria-label="Открыть поиск"
            className="home-search-button"
            onClick={openSearch}
            type="button"
          >
            <span aria-hidden="true" />
          </button>
        </header>

        <div className={`home-search${isSearchOpen ? ' home-search--open' : ''}`}>
          <input
            ref={inputRef}
            aria-label="Поиск по разделам"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Найти раздел или информацию"
            value={query}
          />
        </div>

        <div className="tile-grid">
          {filteredTiles.map((tile) => (
            <AppTile key={tile.href} {...tile} />
          ))}
        </div>
        {filteredTiles.length === 0 && <p className="empty-state">Ничего не найдено. Попробуй другой запрос.</p>}
      </section>
    </main>
  );
}
