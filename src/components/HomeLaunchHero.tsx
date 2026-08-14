import { Link } from 'wouter';

export function HomeLaunchHero() {
  return (
    <section className="home-launch" aria-label="AI assistant launch">
      <div className="home-launch__copy">
        <span className="home-launch__eyebrow">AI для молодых бизнесов</span>
        <h1>
          <span>Освободи 10 часов</span>
          в неделю — без найма новых людей
        </h1>
        <p>
          Попробуй нашего <strong>ии ассистента</strong> прямо сейчас и превращай заявки, фото и
          данные в понятные отчёты.
        </p>
        <div className="home-launch__actions">
          <Link className="home-launch__cta" href="/chat">
            Попробовать AI
          </Link>
          <span className="home-launch__badge">Входящие данные → готовый отчёт</span>
        </div>
      </div>

      <div className="home-launch__visual" aria-label="Входящие данные превращаются в готовый отчет">
        <div className="report-stack" aria-hidden="true">
          <span className="report-page report-page--back" />
          <span className="report-page report-page--front">
            <i className="report-bars" />
            <i className="report-lines" />
          </span>
          <span className="report-tablet">
            <i className="report-chart" />
            <i className="report-pie" />
            <b />
          </span>
          <span className="report-pencil" />
        </div>
      </div>
    </section>
  );
}
