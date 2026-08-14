import { Link } from 'wouter';

export function HomeLaunchHero() {
  return (
    <section className="home-launch" aria-label="AI assistant launch">
      <div className="home-launch__copy">
        <span className="home-launch__eyebrow">AI для молодых бизнесов</span>
        <h1>Освободи 10 часов в неделю — без найма новых людей</h1>
        <p>попробуй нашего ии ассистента прямо сейчас</p>
        <Link className="home-launch__cta" href="/chat">
          Открыть AI чат
        </Link>
      </div>

      <div className="home-launch__pipeline" aria-label="Входящие данные в готовый отчет">
        <span>Входящие данные</span>
        <div className="home-launch__belt" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <strong>готовый отчёт</strong>
      </div>
    </section>
  );
}
