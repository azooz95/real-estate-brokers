import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from '../i18n/I18nContext.jsx';
import AdminApp from '../apps/AdminApp.jsx';
import '../index.css';

// Entry for the ADMIN site (admin.html). Defaults to Arabic? No — keep EN
// default; flip defaultLang here if the admin team prefers Arabic-first.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nProvider storageKey="jiwar.admin.lang">
      <BrowserRouter>
        <AdminApp />
      </BrowserRouter>
    </I18nProvider>
  </React.StrictMode>
);
