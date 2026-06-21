import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { api } from '../../api/client.js';
import { color, shadow } from '../../theme/tokens.js';
import { PhoneFrame, PhoneHeader, StatusBadge, SAR, ShareButton, shareUnit } from '../../components/ui.jsx';

const FILTERS = ['all', '2', '3', '4'];

export default function UnitList() {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [units, setUnits] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.listProjects().then((ps) => setProject(ps.find((p) => p.id === projectId) ?? null));
  }, [projectId]);
  useEffect(() => { api.listUnits(projectId, { type: filter }).then(setUnits); }, [projectId, filter]);

  return (
    <PhoneFrame bg={color.bgStone}>
      <PhoneHeader onBack={() => nav('/projects')} />
      <div style={{ padding: '24px 16px 40px' }}>
        <div style={{ fontSize: 24, color: color.primary, fontWeight: 600 }}>{project?.name ?? ' '}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, color: color.inkSoft, fontSize: 14 }}>
          <span>📍</span>{project?.location ?? t('premium_units_riyadh')}
        </div>

        {/* Filter card */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: color.primary, fontWeight: 600, letterSpacing: '.04em' }}>{t('unit_type')}</span>
            <span style={{ fontSize: 10, color: color.inkSoft }}>{t('select_one')}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: '10px 16px', border: 'none', borderRadius: 4, fontSize: 14, cursor: 'pointer',
                    background: active ? color.primaryHover : '#f5f3f5', color: active ? '#fff' : color.inkSoft }}>
                  {f === 'all' ? t('all') : `${f} ${t('rooms')}`}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 16 }}>
          {units.map((u) => {
            const reserved = u.status === 'reserved';
            return (
              <div key={u.id} style={{ background: '#fff', borderRadius: 4, overflow: 'hidden', boxShadow: shadow.card }}>
                <div style={{ position: 'relative', height: 192 }}>
                  <img src={u.image} alt={u.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: reserved ? 0.55 : 1 }} />
                  <StatusBadge status={u.status} style={{ position: 'absolute', top: 12, insetInlineStart: 12 }} />
                  <ShareButton onClick={() => shareUnit(u.code, lang)} />
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 18, color: color.primary }}>Unit {u.code}</div>
                      <div style={{ fontSize: 12, color: color.inkSoft, marginTop: 4, letterSpacing: '.03em', textTransform: 'uppercase' }}>{u.title}</div>
                    </div>
                    <div style={{ textAlign: 'end' }}>
                      <div style={{ fontSize: 18, color: color.ink }}>{SAR(u.price)}</div>
                      <div style={{ fontSize: 12, color: color.inkSoft }}>{u.priceNote}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 14, padding: '9px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontSize: 12, color: color.ink, display: 'flex', gap: 4 }}><span style={{ color: color.goldSoft }}>🛏</span>{u.rooms} {t('rooms')}</span>
                    <span style={{ fontSize: 12, color: color.ink, display: 'flex', gap: 4 }}><span style={{ color: color.goldSoft }}>🛁</span>{u.baths} Bath</span>
                    <span style={{ fontSize: 12, color: color.ink, display: 'flex', gap: 4 }}><span style={{ color: color.goldSoft }}>⬚</span>{u.area} sqm</span>
                  </div>
                  <button disabled={reserved} onClick={() => nav(`/units/${u.id}`)}
                    style={{ width: '100%', marginTop: 14, border: 'none', borderRadius: 4, padding: 12, fontSize: 12, fontWeight: 600, letterSpacing: '.04em',
                      cursor: reserved ? 'default' : 'pointer', opacity: reserved ? 0.7 : 1,
                      background: reserved ? color.inkSoft : color.primaryHover, color: '#fff' }}>
                    {reserved ? 'RESERVED' : 'VIEW DETAILS & RESERVE'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PhoneFrame>
  );
}
