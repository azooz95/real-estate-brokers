import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from '../i18n/I18nContext.jsx';
import ClientApp from '../apps/ClientApp.jsx';
import '../index.css';

// Entry for the CLIENT site (index.html). Its own language storage key so it
// stays independent from the admin site.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nProvider storageKey="jiwar.client.lang">
      <BrowserRouter>
        <ClientApp />
      </BrowserRouter>
    </I18nProvider>
  </React.StrictMode>
);
