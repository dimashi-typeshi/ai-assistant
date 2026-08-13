export function HomeAdShowcase() {
  return (
    <section className="home-ad-showcase" aria-label="Промо возможности">
      <article className="home-ad-card home-ad-card--security">
        <h2><span>01</span> Безопасный профиль</h2>
        <p>Вход, телефон, настройки и личные данные держатся в одном аккуратном месте.</p>
        <div className="ad-login-grid" aria-hidden="true">
          <span>user@mail.com</span>
          <span>+7 777</span>
          <span />
          <span />
          <span>owner@mail.com</span>
          <span>admin</span>
        </div>
      </article>

      <article className="home-ad-card home-ad-card--deploy">
        <h2><span>02</span> AI команды</h2>
        <p>Запускай помощника без переключения страниц: мини-чат всегда рядом.</p>
        <code>$ assistant open mini chat</code>
        <div className="ad-orbit" aria-hidden="true"><span /></div>
      </article>

      <article className="home-ad-card home-ad-card--vector">
        <h2><span>03</span> Фото и данные</h2>
        <p>ИИ анализирует фото, вытаскивает суммы, даты, заявки и предлагает запись во вкладки.</p>
        <div className="ad-vector-cube" aria-hidden="true">
          <span />
          <i />
          <b />
        </div>
        <ul>
          <li>Анализ фото</li>
          <li>Советы по данным</li>
        </ul>
      </article>

      <article className="home-ad-card home-ad-card--apis">
        <h2><span>04</span> Вкладки</h2>
        <p>Готовые разделы для аренды, платежей, заявок, рекламы и свободных мест.</p>
        <div className="ad-api-list" aria-hidden="true">
          <span>rent</span><b>/rent/contracts</b>
          <span>payments</span><b>/rent/payments</b>
          <span>requests</span><b>/requests</b>
          <span>ads</span><b>/ads</b>
          <span>settings</span><b>/settings</b>
        </div>
      </article>
    </section>
  );
}
