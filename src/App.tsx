import { Route, Switch } from 'wouter';
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
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/ads" component={AdsPage} />
      <Route path="/chat" component={AssistantPage} />
      <Route path="/rent" component={RentPage} />
      <Route path="/payments" component={PaymentsPage} />
      <Route path="/requests" component={RequestsPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}
