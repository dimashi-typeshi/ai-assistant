import { Route, Switch } from 'wouter';
import { AssistantPage } from './pages/AssistantPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <Switch>
      <Route path="/" component={AssistantPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}
