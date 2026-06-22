import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { api } from '../../api/client.js';
import { color, radius, shadow } from '../../theme/tokens.js';
import { PhoneFrame, PhoneHeader, SAR } from '../../components/ui.jsx';

export default function Success() {
  const { t } = useI18n();
  const nav = useNavigate();
  const { id } = useParams();
  const [r, setR] = useState(null);
  useEffect(() => { api.getReservation(id).then(setR); }, [id]);

  const rows = r ? [
    { label: t('unit_code'), value: r.unitCode },
    { label: t('deposit_amount'), value: SAR(r.deposit) + '.00' },
    { label: t('attributed_marketer'), value: r.broker },
  ].filter((row) => row.value) : [];

  const steps = [
    { title: 'Payment Confirmed', body: 'Your deposit has been securely processed via our heritage portal.', done: true },
    { title: 'Sales Team Contact', body: 'A dedicated property consultant will reach out to you within 24 hours.', eta: 'ESTIMATED: WED, 10:00 AM' },
    { title: 'Contract Execution', body: 'Finalize your purchase agreement at our corporate offices or via E-Signature.', muted: true },
  ];

  return (
    <PhoneFrame>
      <PhoneHeader />
      <div style={{ padding: '32px 16px 40px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 96, height: 96, borderRadius: 16, background: color.emeraldMint, display: 'grid', placeItems: 'center',
            margin: '0 auto', fontSize: 44, color: color.emerald, animation: 'pop .5s ease both' }}>✓</div>
          <div style={{ fontSize: 24, color: color.primary, marginTop: 24, lineHeight: 1.2 }}>{t('success_title')}</div>
          <div style={{ fontSize: 16, color: color.inkSoft, marginTop: 12, lineHeight: 1.5 }}>{t('success_sub')}</div>
        </div>

        {/* Receipt */}
        <div style={{ position: 'relative', background: '#fff', borderRadius: 8, marginTop: 24, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', insetInlineStart: 0, top: 0, bottom: 0, width: 4, background: color.primary }} />
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: color.inkSoft, letterSpacing: '.06em' }}>{t('reservation_receipt')}</span>
              <span style={{ fontSize: 16, color: color.primary, fontWeight: 600 }}>#{r?.id}</span>
            </div>
            <div style={{ marginTop: 16 }}>
              {rows.map((row) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f0eef0' }}>
                  <span style={{ fontSize: 16, color: color.inkSoft }}>{row.label}</span>
                  <span style={{ fontSize: 16, color: color.ink, fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14 }}>
                <span style={{ fontSize: 16, color: color.inkSoft }}>{t('status')}</span>
                <span style={{ background: color.emerald, color: color.emeraldMint, fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 12 }}>{t('confirmed')}</span>
              </div>
            </div>
          </div>
          <div onClick={() => r?.receiptUrl && window.open(r.receiptUrl, '_blank')} className={r ? 'tap-target' : ''} style={{ background: '#f5f3f5', textAlign: 'center', padding: 16, borderTop: '1px dashed #d7c9c9', cursor: r ? 'pointer' : 'default' }}>
            <span style={{ color: color.primary, fontSize: 14, fontWeight: 600, letterSpacing: '.04em' }}>⬇ {t('download_receipt')}</span>
          </div>
        </div>

        {/* Next steps timeline */}
        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: 20, color: color.ink }}>{t('next_steps')}</div>
          <div style={{ position: 'relative', marginTop: 24, paddingInlineStart: 36 }}>
            <div style={{ position: 'absolute', insetInlineStart: 11, top: 6, bottom: 24, width: 2, background: '#dac1c0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', insetInlineStart: -36, top: 0, width: 24, height: 24, borderRadius: 12,
                    background: s.done ? color.primary : color.bgWarm,
                    border: s.done ? 'none' : `2px solid ${s.muted ? '#dac1c0' : color.primary}`,
                    display: 'grid', placeItems: 'center', color: '#fff', fontSize: 11 }}>{s.done ? '✓' : ''}</div>
                  <div style={{ fontSize: 16, color: s.muted ? color.inkMuted : color.ink }}>{s.title}</div>
                  <div style={{ fontSize: 16, color: color.inkSoft, marginTop: 4, lineHeight: 1.5 }}>{s.body}</div>
                  {s.eta && <div style={{ display: 'inline-block', background: color.goldFill, color: color.ink, fontSize: 11, padding: '3px 8px', borderRadius: 2, marginTop: 8 }}>{s.eta}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button onClick={() => nav('/')} style={{ width: '100%', background: color.primaryHover, color: '#fff', border: 'none',
            borderRadius: 8, padding: 18, fontSize: 18, cursor: 'pointer', boxShadow: shadow.lift }}>{t('go_dashboard')}</button>
          <button style={{ width: '100%', background: 'transparent', color: color.gold, border: 'none', padding: 14, fontSize: 16, cursor: 'pointer' }}>{t('support_contact')}</button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 24, color: color.inkSoft, fontSize: 12, lineHeight: 1.5 }}>
          © 2024 Jiwar Aloula Real Estate Investment.<br />{t('excellence_tagline')}
        </div>
      </div>
    </PhoneFrame>
  );
}
