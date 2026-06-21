import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { api } from '../../api/client.js';
import { color, shadow } from '../../theme/tokens.js';
import { PhoneFrame, PhoneHeader } from '../../components/ui.jsx';

export default function Projects() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [projects, setProjects] = useState([]);
  useEffect(() => { api.listProjects().then(setProjects); }, []);

  return (
    <PhoneFrame>
      <PhoneHeader onBack={() => nav('/')} />
      <div style={{ padding: '24px 16px 40px' }}>
        <div style={{ fontSize: 24, color: color.primary, fontWeight: 600 }}>{t('our_projects')}</div>
        <div style={{ fontSize: 16, color: color.inkSoft, marginTop: 8, lineHeight: 1.5 }}>{t('projects_sub')}</div>

        {/* Search row */}
        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: '#fff',
            border: `1px solid ${color.line}`, borderRadius: 8, padding: 14 }}>
            <span style={{ color: color.inkSoft }}>🔍</span>
            <span style={{ color: color.placeholder, fontSize: 16 }}>{t('search_name')}</span>
          </div>
          <div style={{ width: 44, height: 49, display: 'grid', placeItems: 'center', background: '#f0edef', borderRadius: 4, color: color.primary }}>⚙</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
          {projects.map((p) => {
            const avail = p.status !== 'reserved';
            return (
              <div key={p.id} style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: shadow.card }}>
                <div style={{ position: 'relative', height: 130 }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 9, insetInlineStart: 9, fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 2,
                    background: avail ? color.emerald : color.primary, color: avail ? color.emeraldMint : '#fff' }}>
                    {avail ? 'AVAILABLE' : 'RESERVED'}
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 18, color: color.primary, lineHeight: 1.15 }}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, color: color.inkSoft, fontSize: 16 }}>
                    <span style={{ color: color.goldSoft }}>📍</span>{p.location}
                  </div>
                  <button onClick={() => nav(`/projects/${p.id}/units`)}
                    style={{ width: '100%', marginTop: 14, background: color.primary, color: '#fff', border: 'none', borderRadius: 4,
                      padding: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', lineHeight: 1.2 }}>
                    {t('explore_units')}
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
