import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { api } from '../../api/client.js';
import { color, radius, shadow } from '../../theme/tokens.js';
import { PhoneFrame, PhoneHeader, StatusBadge } from '../../components/ui.jsx';

export default function UnitDetail() {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const { unitId } = useParams();
  const [u, setU] = useState(null);
  useEffect(() => { api.getUnit(unitId).then(setU); }, [unitId]);
  if (!u) return <PhoneFrame bg={color.bgStone}><PhoneHeader onBack={() => nav(-1)} /></PhoneFrame>;

  const specs = [
    { icon: '🛏', value: u.specs.bedrooms, label: t('bedrooms') },
    { icon: '🛁', value: u.specs.bathrooms, label: t('bathrooms') },
    { icon: '⬚', value: u.specs.area, label: t('sqm_area') },
  ];

  function shareUnit() {
    const data = { title: `${u.title} — Jiwar Aloula`, text: 'Check out this unit at Jiwar Aloula', url: window.location.href };
    if (navigator.share) navigator.share(data).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(() => alert(lang === 'ar' ? 'تم نسخ رابط الوحدة' : 'Unit link copied to clipboard'));
  }

  const shareBtn = (
    <button onClick={shareUnit} aria-label="Share apartment"
      style={{ width: 40, height: 40, display: 'grid', placeItems: 'center', border: '1px solid #ece0e4', background: color.bgWarm, borderRadius: '50%', color: color.primaryHover, fontSize: 17, cursor: 'pointer' }}>⤴</button>
  );

  return (
    <PhoneFrame bg={color.bgStone}>
      <PhoneHeader onBack={() => nav(-1)} right={shareBtn} />

      <div style={{ position: 'relative', height: 300, background: '#dcd9dc' }}>
        <img src={u.gallery[0]} alt={u.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: 16, insetInlineStart: 16, background: color.primary, color: '#fff',
          fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 12 }}>{t('exterior_view')}</div>
      </div>

      <div style={{ padding: '24px 16px 120px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <StatusBadge status={u.status} />
            <div style={{ fontSize: 24, fontWeight: 700, color: color.primary, marginTop: 12, lineHeight: 1.15 }}>{u.title}</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 8, color: color.inkSoft, fontSize: 16 }}><span>📍</span>{u.location}</div>
          </div>
          <div style={{ textAlign: 'end', flex: '0 0 auto' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: color.inkSoft }}>{t('starting_at')}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#2e2e30', lineHeight: 1.2, marginTop: 4 }}>SAR<br />{new Intl.NumberFormat('en-US').format(u.priceFrom)}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 24 }}>
          {specs.map((s) => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 8, padding: '16px 8px', textAlign: 'center', boxShadow: shadow.soft }}>
              <div style={{ fontSize: 18, color: color.primary }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: color.ink, marginTop: 6 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: color.inkSoft, marginTop: 4, letterSpacing: '.03em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <Section title={t('property_description')}>
          <div style={{ ...cardInner }}>
            {u.description.map((p, i) => (
              <p key={i} style={{ margin: i === 0 ? '0 0 16px' : 0, color: color.inkSoft, fontSize: 16, lineHeight: 1.55 }}>{p}</p>
            ))}
          </div>
        </Section>

        <Section title={t('key_amenities')}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {u.amenities.map((a) => (
              <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f5f3f5', borderRadius: 8, padding: 16 }}>
                <span style={{ color: color.gold }}>{a.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: color.goldText }}>{a.label}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title={t('location_map')}>
          <div style={{ position: 'relative', height: 192, borderRadius: 16, overflow: 'hidden' }}>
            <img src={u.map} alt="map" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 32, height: 36,
              background: color.primary, borderRadius: 12, display: 'grid', placeItems: 'center', color: '#fff' }}>📍</div>
          </div>
        </Section>
      </div>

      <div style={{ position: 'sticky', bottom: 0, padding: 16, background: color.bgWarm, borderTop: '1px solid #eee' }}>
        <button disabled={u.status === 'reserved'} onClick={() => nav(`/units/${unitId}/reserve`)}
          style={{ width: '100%', background: u.status === 'reserved' ? color.inkSoft : color.primaryHover, color: color.bgStone, border: 'none', borderRadius: 8,
            padding: 16, fontSize: 16, fontWeight: 700, cursor: u.status === 'reserved' ? 'default' : 'pointer', opacity: u.status === 'reserved' ? 0.7 : 1, boxShadow: shadow.lift }}>
          {u.status === 'reserved' ? t('reserved_lock') : t('reserve_now')}
        </button>
      </div>
    </PhoneFrame>
  );
}

const cardInner = { background: '#fff', borderRadius: 8, padding: 17, marginTop: 16 };
function Section({ title, children }) {
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: color.primary }}>{title}</div>
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}
