import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { api } from '../../api/client.js';
import { color, shadow } from '../../theme/tokens.js';

export default function ForgotPassword() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function send() { await api.forgotPassword({ email }); setSent(true); }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: color.bgWarm, padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 440, background: '#fff', borderRadius: 16, padding: '48px 40px', boxShadow: shadow.modal, textAlign: 'center' }}>
        <img src="/assets/img/86442120d5.png" alt="Jiwar Aloula" style={{ height: 34 }} />
        <div style={{ width: 64, height: 64, borderRadius: 16, background: '#f3d9d9', display: 'grid', placeItems: 'center', margin: '28px auto 0', fontSize: 28, color: color.primary }}>✉</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: color.ink, marginTop: 20 }}>{t('reset_title')}</div>
        <div style={{ fontSize: 15, color: color.inkSoft, marginTop: 8, lineHeight: 1.5 }}>{sent ? 'Check your inbox for the reset link.' : t('reset_sub')}</div>

        <div style={{ textAlign: 'start', marginTop: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: color.inkSoft }}>{t('email_address')}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: color.surfaceAlt, border: `1px solid ${color.line}`, borderRadius: 8, padding: '14px 16px', marginTop: 6 }}>
            <span style={{ color: color.inkMuted }}>✉</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@jiwaraloula.com"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: color.ink }} />
          </div>
        </div>

        <button onClick={send} style={{ width: '100%', marginTop: 24, background: color.primaryHover, color: '#fff', border: 'none', borderRadius: 8, padding: 15, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{t('send_reset')}</button>
        <button onClick={() => nav('/login')} style={{ marginTop: 18, background: 'none', border: 'none', color: color.gold, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>‹ {t('back_login')}</button>
      </div>
    </div>
  );
}
