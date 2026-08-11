import { Link } from 'wouter';

type AppTileProps = {
  href: string;
  icon: string;
  label: string;
  text: string;
};

export function AppTile({ href, icon, label, text }: AppTileProps) {
  return (
    <Link className="app-tile" href={href}>
      <span className="app-tile__icon">{icon}</span>
      <span className="app-tile__label">{label}</span>
      <span className="app-tile__text">{text}</span>
    </Link>
  );
}
