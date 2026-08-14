import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { SectionHeader } from '../components/SectionHeader';
import { AppLanguage, getLanguage, languages, setLanguage } from '../lib/i18n';

export function SettingsPage() {
  const [hideShapes, setHideShapes] = useState(() => localStorage.getItem('hideBackgroundShapes') === 'true');
  const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>(getLanguage);
  const supportText = 'Здравствуйте! Нужна помощь с приложением AI Assistant.';

  useEffect(() => {
    document.body.classList.toggle('hide-background-shapes', hideShapes);
    localStorage.setItem('hideBackgroundShapes', String(hideShapes));
  }, [hideShapes]);

  async function copySupportText() {
    await navigator.clipboard.writeText(supportText);
  }

  function changeLanguage(language: AppLanguage) {
    setCurrentLanguage(language);
    setLanguage(language);
  }

  return (
    <main className="mobile-app-shell">
      <section className="section-page settings-page">
        <SectionHeader subtitle="Фон, поддержка и безопасность аккаунта." title="Настройки" />

        <div className="settings-list">
          <section className="settings-card settings-card--stack">
            <div>
              <h2>Языки</h2>
              <p>Выбери язык интерфейса. Настройка сохранится на этом устройстве.</p>
            </div>
            <div className="settings-language-grid">
              {languages.map((language) => (
                <button
                  className={currentLanguage === language.code ? 'settings-language settings-language--active' : 'settings-language'}
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  type="button"
                >
                  {language.label}
                </button>
              ))}
            </div>
          </section>

          <section className="settings-card">
            <div>
              <h2>Фон</h2>
              <p>Можно убрать декоративные фигуры на главном экране.</p>
            </div>
            <label className="settings-toggle">
              <input checked={hideShapes} onChange={(event) => setHideShapes(event.target.checked)} type="checkbox" />
              <span />
            </label>
          </section>

          <section className="settings-card">
            <div>
              <h2>Поддержка</h2>
              <p>Если что-то сломалось, скопируй текст обращения или открой письмо.</p>
            </div>
            <div className="settings-actions">
              <button onClick={() => void copySupportText()} type="button">Скопировать текст</button>
              <a href={`mailto:support@example.com?subject=AI Assistant support&body=${encodeURIComponent(supportText)}`}>Написать</a>
            </div>
          </section>

          <section className="settings-card settings-card--stack">
            <div>
              <h2>Безопасность</h2>
              <p>Пароль и данные входа управляются через профиль и Supabase Auth.</p>
            </div>
            <Link className="settings-link" href="/profile">Открыть профиль</Link>
            <ul className="settings-checks">
              <li>Не отправляй никому пароль и коды входа.</li>
              <li>Используй сложный пароль для почты.</li>
              <li>Выходи из аккаунта на чужом компьютере.</li>
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}
