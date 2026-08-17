import { Link, useLocation } from 'wouter';

const tools = [
  { href: '/chat', icon: 'AI', label: 'Чат' },
  { href: '/requests', icon: '→', label: 'Заявки' },
  { href: '/rent', icon: 'AR', label: 'Аренда' },
  { href: '/payments', icon: '₸', label: 'Платежи' },
  { href: '/ads', icon: 'AD', label: 'Реклама' },
  { href: '/seats', icon: 'SE', label: 'Места' },
  { href: '/reports', icon: 'RP', label: 'Отчёты' },
  { href: '/settings', icon: '⚙', label: 'Настройки' },
];

function isActive(path: string, href: string) {
  return path === href || path.startsWith(`${href}/`) || (href === '/reports' && path === '/report');
}

export function ToolSwitcher() {
  const [location] = useLocation();

  return (
    <nav className="tool-switcher" aria-label="Быстрый переход между инструментами">
      {tools.map((tool) => (
        <Link
          className={isActive(location, tool.href) ? 'tool-switcher__item tool-switcher__item--active' : 'tool-switcher__item'}
          href={tool.href}
          key={tool.href}
        >
          <span>{tool.icon}</span>
          <strong>{tool.label}</strong>
        </Link>
      ))}
    </nav>
  );
}
