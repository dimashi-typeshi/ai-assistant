import { Route, Switch } from 'wouter';
import { AuthStateRedirect } from './components/AuthStateRedirect';
import { AdsPage } from './pages/AdsPage';
import { AssistantPage } from './pages/AssistantPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ProfilePage } from './pages/ProfilePage';
import { RentPage } from './pages/RentPage';
import { RequestsPage } from './pages/RequestsPage';

export default function App() {
  return (
    <>
      <AuthStateRedirect />
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
        <Route path="/requests" component={RequestsPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </>
  );
}
