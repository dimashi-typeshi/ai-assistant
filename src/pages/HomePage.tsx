import { type CSSProperties, type MouseEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { AppTile } from '../components/AppTile';
import { HomeAdShowcase } from '../components/HomeAdShowcase';
import { HomeFooter } from '../components/HomeFooter';
import { ReviewsRail } from '../components/ReviewsRail';
import overloadedFounderImage from '../assets/overloaded-founder.png';
import slideAiImage from '../assets/slide-ai.png';
import slideDeadlinesImage from '../assets/slide-deadlines.png';
import slideReportsImage from '../assets/slide-reports.png';
import slideTasksImage from '../assets/slide-tasks.png';

const tiles = [
  { href: '/chat', icon: 'AI', label: 'Чат с ИИ', text: 'Идеи, тексты и ответы' },
  { href: '/ads', icon: 'AD', label: 'Создать рекламу', text: 'Баннер для Instagram' },
  { href: '/rent', icon: 'AR', label: 'Аренда', text: 'Сроки, суммы, объекты' },
  { href: '/payments', icon: '₸', label: 'Платежи', text: 'Оплаты и напоминания' },
  { href: '/reports', icon: 'RP', label: 'Отчёты', text: 'Отчёт из выбранных вкладок' },
  { href: '/requests', icon: '→', label: 'Заявки', text: 'Задачи и обращения' },
  { href: '/seats', icon: 'SE', label: 'Свободные места', text: 'Схема здания и отметки мест' },
  { href: '/profile', icon: 'ID', label: 'Профиль', text: 'Данные и настройки' },
];

const settingsTile = { href: '/settings', icon: '⚙', label: 'Настройки', text: 'Параметры приложения' };

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

export function HomePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();
  const [isRailOpen, setIsRailOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [rocketShift, setRocketShift] = useState(0);
  const [query, setQuery] = useState('');
  const cleanQuery = query.trim().toLowerCase();
  const dashboardTiles = tiles.filter((tile) => tile.href !== '/profile');
  const railTiles = [...dashboardTiles, settingsTile];
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

  function moveTextSpotlight(event: MouseEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
  }

  useLayoutEffect(() => {
    window.scrollTo({ left: 0, top: 0 });
  }, []);

  useEffect(() => {
    function updateRocketShift() {
      setRocketShift(Math.min(window.scrollY, 900));
    }

    updateRocketShift();
    window.addEventListener('scroll', updateRocketShift, { passive: true });
    return () => window.removeEventListener('scroll', updateRocketShift);
  }, []);

  return (
    <main className="mobile-app-shell home-dashboard-shell">
      <button
        aria-expanded={isRailOpen}
        aria-label={isRailOpen ? 'Закрыть меню разделов' : 'Открыть меню разделов'}
        className="home-rail-toggle"
        onClick={() => setIsRailOpen((current) => !current)}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>
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
          <Link className="reports-open-button" href="/reports">Отчёты</Link>
          <button aria-label="Открыть поиск" className="home-search-button" onClick={openSearch} type="button">
            <span aria-hidden="true" />
          </button>
          <div className={`home-search${isSearchOpen ? ' home-search--open' : ''}`}>
            <input ref={inputRef} aria-label="Поиск по разделам" onChange={(event) => setQuery(event.target.value)} placeholder="Search..." value={query} />
            {cleanQuery && (
              <div className="home-search-suggestions" role="listbox">
                {searchResults.length > 0 ? searchResults.map((item) => (
                  <Link className="home-search-suggestion" href={item.href} key={`${item.section}-${item.href}`}>
                    {item.label}
                  </Link>
                )) : (
                  <p className="home-search-empty">Ничего не найдено</p>
                )}
              </div>
            )}
          </div>
          <Link className="home-profile-link" href={profileTile.href} aria-label="Открыть профиль">
            <span>{profileTile.icon}</span>
            <strong>{profileTile.label}</strong>
          </Link>
        </div>
      </nav>

      <aside className={`home-rail${isRailOpen ? ' home-rail--open' : ''}`} aria-label="Быстрая навигация">
        {railTiles.map((tile) => (
          <Link className={location === tile.href ? 'home-rail-link home-rail-link--active' : 'home-rail-link'} href={tile.href} key={tile.href}>
            <span>{tile.icon}</span>
            <strong>{tile.label}</strong>
          </Link>
        ))}
        <ReviewsRail />
      </aside>

        <section className="mobile-home">
          <section className="home-hook-workspace" aria-label="Место для работы над хуком">
            <div className="home-hook-workspace__copy">
              <h2 className="text-spotlight" onMouseMove={moveTextSpotlight}>Хватит держать всё в голове</h2>
              <p>Соберите задачи, дедлайны и мелкие хвосты в одном спокойном месте.</p>
              <div className="home-hook-workspace__actions">
                <Link className="home-hook-workspace__cta" href="/requests">Разгрести день</Link>
                <Link className="home-hook-workspace__login" href="/profile">Логин</Link>
                <small>Первый шаг: добавьте одну задачу, остальное разложим по срокам.</small>
              </div>
            </div>
            <div className="home-hook-workspace__visual">
              <img
                alt="Уставший предприниматель рядом с задачами и дедлайнами"
                className="home-hook-workspace__image"
                src={overloadedFounderImage}
              />
            </div>
            <div className="home-hook-workspace__slider">
              <div className="rocket-parallax" style={{ '--rocket-shift': `${rocketShift}px` } as CSSProperties} aria-hidden="true">
                <span className="rocket-parallax__moon" />
                <span className="rocket-parallax__trail" />
                <span className="rocket-parallax__rocket">
                  <i />
                </span>
              </div>
              <div className="feature-slideshow" aria-label="Возможности приложения">
                <div className="feature-slideshow__track">
                  <article className="feature-slide feature-slide--tasks">
                    <div className="feature-slide__top">
                      <span>Задачи</span>
                      <strong>Список без шума</strong>
                    </div>
                    <div className="feature-slide__visual" aria-hidden="true">
                      <img alt="" src={slideTasksImage} />
                      <span className="slide-sticker slide-sticker--top">Focus</span>
                      <span className="slide-sticker slide-sticker--right">4/4 done</span>
                    </div>
                    <p>Соберите дела в один список и снимите их с головы.</p>
                  </article>
                  <article className="feature-slide feature-slide--calendar">
                    <div className="feature-slide__top">
                      <span>Дедлайны</span>
                      <strong>Календарь держит сроки</strong>
                    </div>
                    <div className="feature-slide__visual" aria-hidden="true">
                      <img alt="" src={slideDeadlinesImage} />
                      <span className="slide-sticker slide-sticker--top">On time</span>
                      <span className="slide-sticker slide-sticker--right">24h left</span>
                    </div>
                    <p>Даты, напоминания и приоритеты держатся рядом.</p>
                  </article>
                  <article className="feature-slide feature-slide--ai">
                    <div className="feature-slide__top">
                      <span>ИИ</span>
                      <strong>Черновик за минуту</strong>
                    </div>
                    <div className="feature-slide__visual" aria-hidden="true">
                      <img alt="" src={slideAiImage} />
                      <span className="slide-sticker slide-sticker--top">Draft ready</span>
                      <span className="slide-sticker slide-sticker--right">AI assist</span>
                    </div>
                    <p>Попросите ИИ написать, разобрать или подсказать следующий шаг.</p>
                  </article>
                  <article className="feature-slide feature-slide--reports">
                    <div className="feature-slide__top">
                      <span>Отчёты</span>
                      <strong>Сводка сама собралась</strong>
                    </div>
                    <div className="feature-slide__visual" aria-hidden="true">
                      <img alt="" src={slideReportsImage} />
                      <span className="slide-sticker slide-sticker--top">KPI +18%</span>
                      <span className="slide-sticker slide-sticker--right">Report</span>
                    </div>
                    <p>Сводка по работе собирается без ручной возни.</p>
                  </article>
                </div>
                <div className="feature-slideshow__dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
            <div className="home-hook-workspace__steps">
              <div className="routine-path" aria-label="Порядок действий для избавления от рутины">
                <div className="routine-path__item">
                  <span aria-hidden="true">1</span>
                  <strong>Скиньте задачи в приложение</strong>
                </div>
                <div className="routine-path__item">
                  <span aria-hidden="true">2</span>
                  <strong>Расставьте сроки и приоритеты</strong>
                </div>
                <div className="routine-path__item">
                  <span aria-hidden="true">3</span>
                  <strong>Доверьте напоминания системе</strong>
                </div>
                <div className="routine-path__item routine-path__item--goal">
                  <span aria-hidden="true">✓</span>
                  <strong>Конечная цель - нет рутины</strong>
                </div>
              </div>
              <Link className="home-hook-workspace__try" href="/requests">
                <span>Попробовать</span>
                <span>сейчас</span>
              </Link>
            </div>
          </section>

          <section className="home-promo">
            <div className="home-promo__copy">
              <h1 className="text-spotlight" onMouseMove={moveTextSpotlight}>
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
            <article className="home-promo-card home-promo-card--ai">
              <strong>AI</strong>
              <div className="home-promo-visual home-promo-visual--ai" aria-label="AI чат и анализ">
                <span />
                <i />
                <b />
              </div>
            </article>
            <article className="home-promo-card home-promo-card--payments">
              <strong>₸</strong>
              <div className="home-promo-visual home-promo-visual--payments" aria-label="Платежи и статусы">
                <span />
                <span />
                <span />
              </div>
            </article>
            <article className="home-promo-card home-promo-card--seats">
              <strong>SE</strong>
              <div className="home-promo-visual home-promo-visual--seats" aria-label="Свободные места">
                <span />
                <span />
                <span />
                <span />
              </div>
            </article>
          </div>
        </section>

        <div className="tile-grid" id="tabs" ref={tabsRef}>
          {filteredTiles.map((tile) => (
            <AppTile key={tile.href} {...tile} />
          ))}
        </div>
        {cleanQuery && searchResults.length === 0 && (
          <p className="empty-state">Ничего не найдено. Попробуй другой запрос.</p>
        )}
        <div className="home-mobile-reviews">
          <ReviewsRail />
        </div>
        <HomeAdShowcase />
        <HomeFooter />
      </section>
    </main>
  );
}
