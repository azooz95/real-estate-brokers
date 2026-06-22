import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { api } from '../../api/client.js';
import { color, radius, shadow } from '../../theme/tokens.js';
import { PhoneFrame, PhoneHeader, StatusBadge, SAR, ShareButton, shareUnit } from '../../components/ui.jsx';
import { getTrackingRef } from '../../lib/trackingRef.js';

export default function Home() {
  const { t, lang, setLang } = useI18n();
  const nav = useNavigate();
  const [projects, setProjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [rep, setRep] = useState(null);
  const [repCopied, setRepCopied] = useState(false);

  useEffect(() => {
    const ref = getTrackingRef();
    if (ref) api.getBroker(ref).then(setRep).catch(() => setRep(null));
  }, []);

  function copyRep() {
    if (rep?.mobile && navigator.clipboard) navigator.clipboard.writeText(rep.mobile);
    setRepCopied(true);
    setTimeout(() => setRepCopied(false), 1800);
  }
  const langBtn = (
    <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
      style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f4eef0', border: '1px solid #ece0e4',
        borderRadius: 999, padding: '7px 14px', fontSize: 13, fontWeight: 600, color: color.primaryHover, fontFamily: 'inherit', cursor: 'pointer' }}>
      🌐 {lang === 'en' ? 'العربية' : 'EN'}
    </button>
  );

  useEffect(() => {
    api.listProjects().then((ps) => {
      setProjects(ps);
      if (ps[0]) api.listUnits(ps[0].id).then(setUnits);
    });
  }, []);

  return (
    <PhoneFrame>
      <PhoneHeader right={langBtn} />

      {/* Hero */}
      <div style={{ position: 'relative', background: color.primaryHover, padding: '40px 16px 18px', overflow: 'hidden' }}>
        <img src="/assets/img/10655a55ec.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.14 }} />
        <div style={{ position: 'relative' }}>
          <div style={{ color: '#fff', fontSize: 24, fontWeight: 700, lineHeight: 1.1 }}>{t('hero_title')}</div>
          <div style={{ color: 'rgba(255,255,255,.88)', fontSize: 16, marginTop: 8, lineHeight: 1.5 }}>{t('hero_sub')}</div>
          {rep && (
            <button onClick={copyRep} style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'start', background: 'rgba(255,255,255,.12)',
              border: '1px solid rgba(255,255,255,.25)', borderRadius: 12, padding: '9px 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
              <span style={{ color: '#fff' }}>👤</span>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 600, flex: 1 }}>{t('your_rep')} {rep.name}</span>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, opacity: 0.9 }}>{repCopied ? (lang === 'ar' ? '✓ تم النسخ' : '✓ Copied') : '📞'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Projects rail */}
      <div style={{ padding: '24px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: color.primary }}>{t('our_projects')}</div>
          <button onClick={() => nav('/projects')} style={{ border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, color: color.gold, letterSpacing: '.06em' }}>{t('view_all')}</button>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {projects.map((p) => (
            <div key={p.id} className="tap-target" style={{ flex: '0 0 auto', width: 160 }} onClick={() => nav(`/projects/${p.id}/units`)}>
              <div style={{ position: 'relative', height: 96, borderRadius: 8, overflow: 'hidden' }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.6), rgba(0,0,0,0))' }} />
              </div>
              <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: color.ink, marginTop: 8 }}>{p.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Available units */}
      <div style={{ padding: '24px 16px 28px' }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: color.ink }}>{t('available_units')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 16 }}>
          {units.map((u) => {
            const reserved = u.status === 'reserved';
            return (
              <div key={u.id} style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: shadow.card }}>
                <div style={{ position: 'relative', height: 192 }}>
                  <img src={u.image} alt={u.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: reserved ? 0.6 : 1 }} />
                  <StatusBadge status={u.status} style={{ position: 'absolute', top: 12, insetInlineStart: 12 }} />
                  <ShareButton onClick={() => shareUnit(u.code, lang)} />
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 600, color: reserved ? color.inkSoft : color.primary }}>{u.code}</div>
                      <div style={{ fontSize: 14, color: color.inkSoft, marginTop: 4 }}>{u.rooms} Bd · {u.baths} Ba · {u.area} sqm</div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: reserved ? color.inkSoft : color.ink, whiteSpace: 'nowrap' }}>{SAR(u.price)}</div>
                  </div>
                  <button disabled={reserved} onClick={() => nav(`/units/${u.id}`)}
                    style={{ width: '100%', marginTop: 16, border: 'none', borderRadius: 4, padding: 14, fontSize: 12, fontWeight: 600,
                      letterSpacing: '.05em', cursor: reserved ? 'default' : 'pointer',
                      background: reserved ? color.line : color.primary, color: reserved ? color.inkSoft : '#fff' }}>
                    {reserved ? 'RESERVED' : 'VIEW DETAILS & RESERVE'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={() => nav('/projects')} aria-label="search"
        style={{ position: 'fixed', bottom: 20, insetInlineEnd: 16, width: 56, height: 56, border: 'none', zIndex: 10,
          borderRadius: 16, background: color.gold, color: '#fff', fontSize: 20, boxShadow: '0 12px 24px -6px rgba(114,90,64,.6)', cursor: 'pointer' }}>🔍</button>
    </PhoneFrame>
  );
}
