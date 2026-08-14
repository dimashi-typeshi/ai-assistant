import { useEffect } from 'react';
import { Route, Switch } from 'wouter';
import { AuthStateRedirect } from './components/AuthStateRedirect';
import { FloatingAiChat } from './components/FloatingAiChat';
import { AdsPage } from './pages/AdsPage';
import { AssistantPage } from './pages/AssistantPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ProfilePage } from './pages/ProfilePage';
import { RentPage } from './pages/RentPage';
import { ReportsPage } from './pages/ReportsPage';
import { RequestsPage } from './pages/RequestsPage';
import { SeatsPage } from './pages/SeatsPage';
import { SettingsPage } from './pages/SettingsPage';
import { applyTranslations } from './lib/i18n';

export default function App() {
  useEffect(() => {
    document.body.classList.toggle('light-theme', localStorage.getItem('appTheme') === 'light');

    let frame = 0;
    const translateSoon = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => applyTranslations());
    };
    const observer = new MutationObserver(translateSoon);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('app-language-change', translateSoon);
    translateSoon();
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('app-language-change', translateSoon);
    };
  }, []);

  return (
    <>
      <AuthStateRedirect />
      <FloatingAiChat />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/dashboard" component={HomePage} />
        <Route path="/ads" component={AdsPage} />
        <Route path="/chat" component={AssistantPage} />
        <Route path="/rent" component={RentPage} />
        <Route path="/rent/contracts" component={RentPage} />
        <Route path="/rent/payments" component={RentPage} />
        <Route path="/rent/notes" component={RentPage} />
        <Route path="/payments" component={PaymentsPage} />
        <Route path="/payments/operations" component={PaymentsPage} />
        <Route path="/payments/pending" component={PaymentsPage} />
        <Route path="/payments/reminders" component={PaymentsPage} />
        <Route path="/report" component={ReportsPage} />
        <Route path="/reports" component={ReportsPage} />
        <Route path="/reports/" component={ReportsPage} />
        <Route path="/requests" component={RequestsPage} />
        <Route path="/seats" component={SeatsPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </>
  );
}
