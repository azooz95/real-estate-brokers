import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LangToggle from '../components/LangToggle.jsx';
import { ToastProvider } from '../components/Toast.jsx';
import Login from '../screens/admin/Login.jsx';
import ForgotPassword from '../screens/admin/ForgotPassword.jsx';
import AdminLayout from '../screens/admin/AdminLayout.jsx';
import Dashboard from '../screens/admin/Dashboard.jsx';
import Inventory from '../screens/admin/Inventory.jsx';
import Marketers from '../screens/admin/Marketers.jsx';
import Transactions from '../screens/admin/Transactions.jsx';
import Settings from '../screens/admin/Settings.jsx';
import { api } from '../api/client.js';

// Gate for everything under "/": confirms the session cookie set by
// api.login is still valid before rendering the dashboard, instead of
// rendering it unconditionally and relying on each screen's API calls to
// fail closed.
function RequireAuth() {
  const [authed, setAuthed] = useState(null); // null = checking

  useEffect(() => {
    let active = true;
    api.getMe()
      .then(() => active && setAuthed(true))
      .catch(() => active && setAuthed(false));
    return () => { active = false; };
  }, []);

  if (authed === null) return null;
  return authed ? <Outlet /> : <Navigate to="/login" replace />;
}

// ADMIN site — the marketer/admin console. Deployed at its own domain
// (e.g. admin.jiwaraloula.com), separate from the client site. Routes live at
// the domain root (no /admin prefix — the prefix WAS the domain).
export default function AdminApp() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="marketers" element={<Marketers />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <LangToggle />
    </ToastProvider>
  );
}
