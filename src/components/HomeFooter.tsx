import { Link } from 'wouter';

const productLinks = [
  { href: '/chat', label: 'Чат с ИИ' },
  { href: '/ads', label: 'Создать рекламу' },
  { href: '/rent', label: 'Аренда' },
  { href: '/payments', label: 'Платежи' },
  { href: '/requests', label: 'Заявки' },
  { href: '/seats', label: 'Свободные места' },
];

const aiLinks = [
  { href: '/chat', label: 'Генерация ответов' },
  { href: '/chat', label: 'Советы по данным' },
  { href: '/chat', label: 'Анализ фото' },
  { href: '/chat', label: 'Запись во вкладки с разрешением' },
];

const accountLinks = [
  { href: '/profile', label: 'Профиль' },
  { href: '/settings', label: 'Настройки' },
  { href: '/settings', label: 'Поддержка' },
  { href: '/settings', label: 'Безопасность' },
];

export function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer__columns">
        <section>
          <h2>AI ASSISTANT</h2>
          {productLinks.map((link) => <Link href={link.href} key={link.label}>{link.label}</Link>)}
        </section>
        <section>
          <h2>ИИ ВОЗМОЖНОСТИ</h2>
          {aiLinks.map((link) => <Link href={link.href} key={link.label}>{link.label}</Link>)}
        </section>
        <section>
          <h2>АККАУНТ</h2>
          {accountLinks.map((link) => <Link href={link.href} key={link.label}>{link.label}</Link>)}
        </section>
      </div>
      <div className="home-footer__bottom">
        <p>Учебный продукт nFactorial Teens для молодых бизнесов: задачи, аренда, платежи, заявки, реклама и AI-помощник в одном рабочем пространстве.</p>
        <nav aria-label="Нижняя навигация">
          <Link href="/settings">Доступность</Link>
          <Link href="/settings">Конфиденциальность</Link>
          <Link href="/settings">Условия использования</Link>
        </nav>
      </div>
    </footer>
  );
}
