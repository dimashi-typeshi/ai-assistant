import { Link } from 'wouter';

type RentSectionPlaceholderProps = {
  title: string;
  text: string;
};

export function RentSectionPlaceholder({ title, text }: RentSectionPlaceholderProps) {
  return (
    <section className="rent-placeholder">
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="back-link" href="/rent">Назад к аренде</Link>
    </section>
  );
}
