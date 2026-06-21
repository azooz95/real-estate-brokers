import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { api } from '../../api/client.js';
import { color, shadow } from '../../theme/tokens.js';

export default function Login() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  async function signIn() {
    await api.login(form);          // sets session cookie / token on backend
    nav('/dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: color.bgWarm, padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 1000, display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff',
        borderRadius: 16, overflow: 'hidden', boxShadow: shadow.modal }}>
        {/* Brand panel */}
        <div style={{ position: 'relative', background: color.primary, padding: '56px 48px', display: 'flex',
          flexDirection: 'column', justifyContent: 'space-between', minHeight: 540 }}>
          <img src="/assets/img/10655a55ec.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08 }} />
          <div style={{ position: 'relative' }}><img src="/assets/img/logo-white.png" alt="Jiwar Aloula" style={{ height: 40 }} /></div>
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1.25 }}>Architectural<br />Precision in<br />Real Estate.</div>
            <div style={{ width: 48, height: 3, background: color.goldSoft, margin: '24px 0' }} />
            <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, lineHeight: 1.6 }}>Central command for inventory, marketers, and reservation flows across the Jiwar Aloula portfolio.</div>
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.55)', fontSize: 12 }}>🔒 {t('secure_badge')}</div>
        </div>

        {/* Form */}
        <div style={{ padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: color.ink }}>{t('login_title')}</div>
          <div style={{ fontSize: 15, color: color.inkSoft, marginTop: 8, lineHeight: 1.5 }}>{t('login_sub')}</div>

          <Label>{t('username_email')}</Label>
          <InputRow icon="✉">
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@jiwaraloula.com" style={bare} />
          </InputRow>

          <Label>{t('password')}</Label>
          <InputRow icon="🔒" trailing="👁">
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••••" style={bare} />
          </InputRow>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: color.inkSoft, fontSize: 14 }}>
              <span style={{ width: 16, height: 16, borderRadius: 4, background: color.primary, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 10 }}>✓</span>
              {t('remember_me')}
            </label>
            <button onClick={() => nav('/forgot')} style={{ background: 'none', border: 'none', color: color.gold, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{t('forgot_password')}</button>
          </div>

          <button onClick={signIn} style={{ marginTop: 28, background: color.primaryHover, color: '#fff', border: 'none',
            borderRadius: 8, padding: 15, fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: shadow.lift }}>{t('sign_in')}</button>
          <div style={{ textAlign: 'center', marginTop: 28, color: color.placeholder, fontSize: 12 }}>{t('login_footer')}</div>
        </div>
      </div>
    </div>
  );
}

const bare = { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: color.ink };
function Label({ children }) {
  return <div style={{ fontSize: 13, fontWeight: 600, color: color.inkSoft, letterSpacing: '.03em', marginTop: 20 }}>{children}</div>;
}
function InputRow({ icon, trailing, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: color.surfaceAlt, border: `1px solid ${color.line}`,
      borderRadius: 8, padding: '14px 16px', marginTop: 6 }}>
      <span style={{ color: color.inkMuted }}>{icon}</span>
      {children}
      {trailing && <span style={{ color: color.inkMuted }}>{trailing}</span>}
    </div>
  );
}
