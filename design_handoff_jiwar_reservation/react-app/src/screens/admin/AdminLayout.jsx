import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { color } from '../../theme/tokens.js';
import { api } from '../../api/client.js';

const NAV = [
  { to: 'dashboard',    key: 'nav_dashboard',    icon: '▦' },
  { to: 'inventory',    key: 'nav_inventory',    icon: '▤' },
  { to: 'marketers',    key: 'nav_brokers',      icon: '◷' },
  { to: 'transactions', key: 'nav_transactions', icon: '⇄' },
  { to: 'settings',     key: 'nav_settings',     icon: '⚙' },
];

export default function AdminLayout() {
  const { t } = useI18n();
  const nav = useNavigate();

  async function signOut() {
    try {
      await api.logout();
    } catch {
      // Even if the request fails, drop the client back to login —
      // staying signed in on a console with no working logout is worse.
    } finally {
      nav('/login', { replace: true });
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: color.bgAdmin }}>
      {/* Sidebar */}
      <aside style={{ width: 264, flex: '0 0 264px', background: color.sidebar, display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
        <div style={{ padding: '0 8px 24px' }}><img src="/assets/img/logo-white.png" alt="Jiwar Aloula" style={{ height: 32 }} /></div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className="tap-target" style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 16, padding: '11px 16px', borderRadius: 4, fontSize: 14,
              background: isActive ? color.primaryHover : 'transparent',
              color: isActive ? color.accentRose : color.sidebarItem,
            })}>
              <span style={{ fontSize: 16 }}>{n.icon}</span>{t(n.key)}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 8px' }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: color.primaryHover, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700 }}>AM</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Admin Manager</div>
            <div style={{ color: color.emeraldSoft, fontSize: 11 }}>● {t('status_active')}</div>
          </div>
          <button onClick={signOut} title={t('sign_out')} aria-label={t('sign_out')} className="tap-target"
            style={{ width: 34, height: 34, flex: '0 0 34px', display: 'grid', placeItems: 'center', border: '1px solid rgba(255,255,255,.12)',
              background: 'rgba(255,255,255,.06)', borderRadius: 8, color: color.accentRose, fontSize: 15 }}>⏻</button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 28px', background: '#fff', borderBottom: `1px solid ${color.lineSoft}` }}>
          <div style={{ flex: 1, maxWidth: 420, display: 'flex', alignItems: 'center', gap: 10, background: '#f5f2f4', borderRadius: 8, padding: '10px 14px' }}>
            <span style={{ color: color.inkMuted }}>🔍</span>
            <span style={{ color: color.placeholder, fontSize: 14 }}>{t('search_inventory')}</span>
          </div>
          <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ color: color.inkSoft, fontSize: 18 }}>🔔</span>
            <span style={{ color: color.inkSoft, fontSize: 12, fontWeight: 600 }}>{t('admin_console')}</span>
          </div>
        </header>
        <main style={{ flex: 1, padding: 28, overflow: 'auto' }}><Outlet /></main>
      </div>
    </div>
  );
}
