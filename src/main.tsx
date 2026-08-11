import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/base.css';
import './styles/mobile-app.css';
import './styles/assistant.css';
import './styles/chat.css';
import './styles/requests.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
