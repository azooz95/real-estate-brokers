import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { api } from '../../api/client.js';
import { color, shadow, radius } from '../../theme/tokens.js';
import { StatusBadge } from '../../components/ui.jsx';

const BADGE = { available: 'available_badge', hold: 'on_hold_badge', reserved: 'reserved_lock' };

// `unit` = the inventory row (code, project, beds, baths, status).
// onApply(code, newStatus, reason) persists the override (admin hold / release / confirm).
// Holder, gallery, and the activity timeline come from GET /api/inventory/:code
// (real reservation + status-change history) rather than hand-authored mock data.
export default function UnitModal({ unit, onClose, onApply }) {
  const { t } = useI18n();
  const [detail, setDetail] = useState(null);
  const [tab, setTab] = useState('gallery');
  const [draftStatus, setDraftStatus] = useState(unit.status);
  const [reason, setReason] = useState('');

  useEffect(() => { api.getUnitAdminDetail(unit.code).then(setDetail); }, [unit.code]);

  const statusOptions = [
    ['available', t('opt_available')], ['hold', t('opt_hold')],
    ['reserved', t('opt_reserved')], ['cancelled', t('opt_cancelled')],
  ];

  const tabStyle = (active) => ({
    flex: 1, padding: '18px 20px', background: active ? color.bgWarm : 'transparent', border: 'none', cursor: 'pointer',
    fontSize: 16, fontWeight: 600, fontFamily: 'inherit', color: active ? color.primary : color.inkMuted,
    borderBottom: `2px solid ${active ? color.primary : 'transparent'}`,
  });
  const label = { fontSize: 11, fontWeight: 700, color: color.inkMuted, letterSpacing: '.06em', margin: '18px 0 8px' };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(20,8,12,.55)', backdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 1180, maxHeight: '92vh', background: '#fff', borderRadius: 16,
        overflow: 'hidden', boxShadow: '0 50px 120px -30px rgba(0,0,0,.6)', display: 'grid', gridTemplateColumns: '1.04fr 1fr' }}>

        {!detail ? (
          <div style={{ gridColumn: '1 / -1', padding: 64, textAlign: 'center', color: color.inkMuted }}>{t('loading') ?? 'Loading…'}</div>
        ) : (
        <>
        {/* LEFT — gallery */}
        <div style={{ background: color.bgAdmin, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #ece6e9' }}>
            <button style={tabStyle(tab === 'gallery')} onClick={() => setTab('gallery')}>{t('gallery_tab')}</button>
            <button style={tabStyle(tab === 'blueprint')} onClick={() => setTab('blueprint')}>{t('blueprint_tab')}</button>
          </div>
          <div style={{ flex: 1, padding: '28px 32px 8px', minHeight: 0, display: 'flex' }}>
            <div style={{ position: 'relative', flex: 1, borderRadius: 6, overflow: 'hidden', background: '#2a2326' }}>
              <img src={tab === 'blueprint' ? (detail.map ?? detail.image) : detail.gallery[0]} alt={unit.code}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: tab === 'blueprint' ? 0.9 : 1 }} />
              {tab === 'gallery' && (
                <div style={{ position: 'absolute', bottom: 16, insetInlineEnd: 16, display: 'flex', alignItems: 'center', gap: 8,
                  background: color.ink, color: '#fff', fontSize: 11, fontWeight: 600, letterSpacing: '.04em', padding: '8px 14px', borderRadius: 6 }}>⛶ {t('vr_enabled')}</div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, padding: '20px 32px 28px' }}>
            {[[t('m_bedrooms'), `${detail.beds} Units`], [t('m_bathrooms'), `${detail.baths} Units`], [t('m_area'), detail.area], [t('m_level'), detail.level]].map(([k, v]) => (
              <div key={k} style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: color.inkMuted, letterSpacing: '.06em' }}>{k}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: color.ink, marginTop: 6 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — details + override */}
        <div style={{ padding: 32, overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <StatusBadge status={unit.status}>{t(BADGE[unit.status])}</StatusBadge>
              <span style={{ fontSize: 12, color: color.inkMuted, letterSpacing: '.04em' }}>• {t('internal_id')}: {detail.internalId}</span>
            </div>
            <button onClick={onClose} style={{ width: 34, height: 34, border: 'none', background: 'transparent', color: color.inkSoft, fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>✕</button>
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: color.ink, marginTop: 12, lineHeight: 1.1 }}>Unit {unit.code}</div>
          <div style={{ fontSize: 16, color: color.inkSoft, marginTop: 6 }}>{detail.phase}</div>

          <div style={{ fontSize: 12, fontWeight: 700, color: color.primary, letterSpacing: '.08em', margin: '24px 0 14px', paddingBottom: 12, borderBottom: `1px solid ${color.lineSoft}` }}>{t('activity_ownership')}</div>

          {detail.holder ? (
            <div style={{ border: '1px solid #ece6e9', borderRadius: 12, padding: 18, display: 'flex', gap: 16, alignItems: 'center' }}>
              <Avatar bg={color.primaryHover} fg="#fff" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: color.primary, letterSpacing: '.06em' }}>{t('current_holder')}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: color.ink, marginTop: 2 }}>{detail.holder.name}</div>
                <div style={{ display: 'flex', gap: 18, marginTop: 8, color: color.inkSoft, fontSize: 13, flexWrap: 'wrap' }}>
                  <span>📞 {detail.holder.phone}</span><span>🕐 {detail.holder.since}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ border: '1px dashed #d9cdd0', borderRadius: 12, padding: 18, display: 'flex', gap: 16, alignItems: 'center', background: color.bgWarm }}>
              <Avatar bg="#ece6e9" fg={color.inkMuted} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: color.inkMuted, letterSpacing: '.06em' }}>{t('current_holder')}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: color.ink, marginTop: 2 }}>{t('no_holder_title')}</div>
                <div style={{ fontSize: 13, color: color.inkSoft, marginTop: 6 }}>{t('no_holder_sub')}</div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 22 }}>
            {detail.timeline.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 34, height: 34, flex: '0 0 34px', borderRadius: 9, background: color.lineSoft, display: 'grid', placeItems: 'center', fontSize: 15 }}>{e.icon}</div>
                <div style={{ paddingTop: 2 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: color.ink }}>{e.title}</div>
                  <div style={{ fontSize: 12, color: color.inkMuted, marginTop: 2 }}>{e.meta}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Administrative override */}
          <div style={{ marginTop: 24, background: '#faf7f8', border: '1px solid #efe7ea', borderRadius: 12, padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: color.primary, fontSize: 18 }}>🛡</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: color.ink }}>{t('admin_override')}</span>
            </div>
            <div style={label}>{t('manual_status_toggle')}</div>
            <div style={{ position: 'relative' }}>
              <select value={draftStatus} onChange={(e) => setDraftStatus(e.target.value)}
                style={{ width: '100%', appearance: 'none', background: '#fff', border: '1px solid #e3dde1', borderRadius: 8, padding: '15px 16px', fontSize: 16, fontFamily: 'inherit', color: color.ink, cursor: 'pointer' }}>
                {statusOptions.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <span style={{ position: 'absolute', top: '50%', insetInlineEnd: 16, transform: 'translateY(-50%)', pointerEvents: 'none', color: color.inkMuted }}>⌄</span>
            </div>
            <div style={label}>{t('reason_for_change')}</div>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t('reason_placeholder')}
              style={{ width: '100%', minHeight: 84, resize: 'vertical', background: '#fff', border: '1px solid #e3dde1', borderRadius: 8, padding: '14px 16px', fontSize: 15, fontFamily: 'inherit', color: color.ink, outline: 'none' }} />
            <button onClick={() => onApply(unit.code, draftStatus, reason)}
              style={{ width: '100%', marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: 'linear-gradient(180deg, #671f23, #4a0810)', color: '#fff', border: 'none', borderRadius: 10, padding: 16, fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 10px 24px -8px rgba(74,8,16,.55)' }}>
              🛡 {t('apply_status_change')}
            </button>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}

function Avatar({ bg, fg }) {
  return (
    <div style={{ width: 52, height: 52, flex: '0 0 52px', borderRadius: 10, background: bg, display: 'grid', placeItems: 'center' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill={fg} /><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" fill={fg} /></svg>
    </div>
  );
}
