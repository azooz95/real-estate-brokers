import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { api } from '../../api/client.js';
import { color, shadow } from '../../theme/tokens.js';
import { useToast } from '../../components/Toast.jsx';

const TONE = {
  gold: ['#fbe3c9', '#281804'], rose: ['#f3d9d9', '#3f0209'], mint: ['#cfeee6', '#00201a'],
  sand: ['#e8dcc9', '#765e44'], neutral: ['#e4e2e4', '#1b1b1d'],
};
const BAR = { Available: color.emerald, Reserved: color.inkMuted, Hold: color.goldSoft };

function downloadInventoryCsv(toast) {
  api.listInventory().then((rows) => {
    const cols = ['code', 'project', 'floor', 'beds', 'baths', 'area', 'price', 'status'];
    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [cols.join(','), ...rows.map((r) => cols.map((c) => escape(r[c])).join(','))];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Inventory CSV downloaded.');
  }).catch(() => toast.error('Could not export the inventory. Please try again.'));
}

export default function Dashboard() {
  const { t } = useI18n();
  const toast = useToast();
  const [d, setD] = useState(null);
  useEffect(() => { api.getDashboard().then(setD); }, []);
  if (!d) return null;

  return (
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: color.ink }}>{t('cmd_dashboard')}</div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginTop: 20 }}>
        {d.kpis.map((k) => (
          <div key={k.label} style={{ ...panel, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: color.inkMuted, letterSpacing: '.06em' }}>{k.label}</span>
              {k.delta && <span style={{ background: color.emeraldChipBg, color: color.emeraldText, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>↑ {k.delta}</span>}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: color.primary, marginTop: 12 }}>{k.value}</div>
            {k.sub && <div style={{ fontSize: 12, color: color.emeraldText, marginTop: 4 }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, marginTop: 20 }}>
        {/* Activity */}
        <div style={{ ...panel, padding: 22 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: color.ink }}>{t('recent_activity')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 12 }}>
            {d.activity.map((a, i) => {
              const [bg, fg] = TONE[a.tone] || TONE.neutral;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: `1px solid ${color.lineSoft}` }}>
                  <div style={{ width: 40, height: 40, flex: '0 0 40px', borderRadius: 10, background: bg, color: fg, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700 }}>{a.ini}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, color: color.ink, fontWeight: 500 }}>{a.text}</div>
                    <div style={{ fontSize: 12, color: color.inkMuted, marginTop: 2 }}>{a.meta}</div>
                  </div>
                  {a.amount && <div style={{ fontSize: 14, fontWeight: 700, color: color.emerald, whiteSpace: 'nowrap' }}>{a.amount}</div>}
                  {a.tag && <div style={{ fontSize: 10, fontWeight: 700, color: color.inkMuted, letterSpacing: '.05em' }}>{a.tag}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Inventory status */}
        <div style={{ ...panel, padding: 22 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: color.ink }}>{t('inventory_status')}</div>
          <div style={{ textAlign: 'center', margin: '18px 0' }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: color.primary }}>{d.inventoryStatus.total}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: color.inkMuted, letterSpacing: '.08em' }}>{t('total_units')}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {d.inventoryStatus.breakdown.map((s) => (
              <div key={s.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: color.inkSoft }}>
                  <span>{s.label}</span><span style={{ fontWeight: 600 }}>{s.units} Units</span>
                </div>
                <div style={{ height: 8, background: color.lineSoft, borderRadius: 5, marginTop: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.pct}%`, background: BAR[s.label], borderRadius: 5 }} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => downloadInventoryCsv(toast)} style={{ width: '100%', marginTop: 22, background: color.primary, color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontSize: 12, fontWeight: 600, letterSpacing: '.04em', cursor: 'pointer' }}>⬇ {t('download_inventory')}</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 20 }}>
        {[['market_sentiment', 'Highly Bullish'], ['verification_queue', '12 Requests Pending'], ['platform_load', 'Normal (0.2s)']].map(([k, v]) => (
          <div key={k} style={{ ...panel, padding: '18px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: color.inkMuted, letterSpacing: '.05em' }}>{t(k)}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: color.ink, marginTop: 6 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const panel = { background: '#fff', borderRadius: 12, boxShadow: shadow.soft };
