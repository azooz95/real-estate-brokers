import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { api } from '../../api/client.js';
import { color, shadow } from '../../theme/tokens.js';
import { StatusBadge } from '../../components/ui.jsx';
import { useToast } from '../../components/Toast.jsx';
import UnitModal from './UnitModal.jsx';

const fmt = (n) => new Intl.NumberFormat('en-US').format(n);
const sarShort = (n) => n >= 1_000_000 ? `SAR ${(n / 1_000_000).toFixed(1)}M` : `SAR ${fmt(Math.round(n))}`;

export default function Inventory() {
  const { t } = useI18n();
  const toast = useToast();
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [openCode, setOpenCode] = useState(null);   // unit shown in the modal
  useEffect(() => { api.listInventory().then(setRows); }, []);

  // Admin action: change a unit's status (hold / release / confirm). Optimistic
  // update; persists via api.setUnitStatus (PATCH /api/units/:code/status),
  // rolled back with an error toast if the request fails.
  async function setUnitStatus(code, status, reason) {
    const previous = rows.find((r) => r.code === code)?.status;
    setRows((prev) => prev.map((r) => (r.code === code ? { ...r, status } : r)));
    try {
      await api.setUnitStatus(code, status, reason);
      toast.success(`Unit ${code} status updated to ${status}.`);
    } catch {
      setRows((prev) => prev.map((r) => (r.code === code ? { ...r, status: previous } : r)));
      toast.error(`Could not update unit ${code}. Please try again.`);
    }
  }
  const openUnit = rows.find((r) => r.code === openCode) || null;

  const th = { textAlign: 'start', padding: '14px 20px', fontSize: 11, fontWeight: 700, color: color.inkMuted, letterSpacing: '.05em' };
  const td = { padding: '16px 20px', fontSize: 14, color: color.ink };
  const iconBtn = { width: 34, height: 34, display: 'inline-grid', placeItems: 'center', background: color.bgWarm, color: color.primaryHover, border: '1px solid #ece4e6', borderRadius: 8, fontSize: 15, cursor: 'pointer' };
  const actStyle = { hold: iconBtn, release: iconBtn, manage: iconBtn };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: color.ink }}>{t('inv_directory')}</div>
          <div style={{ fontSize: 14, color: color.inkMuted, marginTop: 4 }}>{rows.length} units across the portfolio</div>
        </div>
        <button style={{ background: color.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '11px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{t('manual_sync')}</button>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, marginTop: 20, overflow: 'hidden', boxShadow: shadow.soft }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: color.surfaceAlt }}>
              <th style={th}>{t('th_unitcode')}</th>
              <th style={th}>{t('th_project')}</th>
              <th style={th}>{t('th_floor')}</th>
              <th style={th}>{t('th_specs')}</th>
              <th style={{ ...th, textAlign: 'end' }}>{t('th_price')}</th>
              <th style={{ ...th, textAlign: 'center' }}>{t('th_status')}</th>
              <th style={{ ...th, textAlign: 'center' }}>{t('th_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const reserved = r.status === 'reserved';
              const hold = r.status === 'hold';
              const variant = reserved ? 'manage' : hold ? 'release' : 'hold';
              const label = reserved ? t('manage_unit') : hold ? t('release_unit') : t('hold_unit');
              return (
              <tr key={r.code} style={{ borderTop: `1px solid ${color.lineSoft}` }}>
                <td style={{ ...td, fontWeight: 700, color: color.primary, fontSize: 13 }}>{r.code}</td>
                <td style={td}>{r.project}</td>
                <td style={{ ...td, color: color.inkSoft }}>Floor {r.floor}</td>
                <td style={{ ...td, fontSize: 13, color: color.inkSoft }}>{r.beds} Bd · {r.baths} Ba</td>
                <td style={{ ...td, fontWeight: 600, textAlign: 'end' }}>{fmt(r.price)}</td>
                <td style={{ ...td, textAlign: 'center' }}><StatusBadge status={r.status} /></td>
                <td style={{ ...td, textAlign: 'center' }}>
                  <button style={actStyle[variant]} onClick={() => setOpenCode(r.code)} title={label} aria-label={label}>
                    ⚙
                  </button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) 1.2fr', gap: 18, marginTop: 20 }}>
        {[
          ['inventory_value', sarShort(rows.reduce((s, r) => s + r.price, 0)), color.primary],
          ['available_ratio', rows.length ? `${((rows.filter((r) => r.status === 'available').length / rows.length) * 100).toFixed(1)}%` : '—', color.emeraldText],
          ['avg_price_sqm', (() => { const area = rows.reduce((s, r) => s + (r.area || 0), 0); return area ? sarShort(rows.reduce((s, r) => s + r.price, 0) / area) : '—'; })(), color.ink],
        ].map(([k, v, c]) => (
          <div key={k} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: shadow.soft }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: color.inkMuted, letterSpacing: '.05em' }}>{t(k)}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: c, marginTop: 8 }}>{v}</div>
          </div>
        ))}
        <div style={{ background: color.primary, borderRadius: 12, padding: 20, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: color.accentRose, letterSpacing: '.05em' }}>{t('admin_quick_action')}</div>
          <button onClick={() => nav('/marketers')} style={{ marginTop: 12, background: color.goldSoft, color: '#2e1c0a', border: 'none', borderRadius: 8, padding: 11, fontSize: 12, fontWeight: 700, letterSpacing: '.04em', cursor: 'pointer' }}>{t('generate_now')}</button>
        </div>
      </div>

      {openUnit && (
        <UnitModal
          unit={openUnit}
          onClose={() => setOpenCode(null)}
          onApply={(code, status, reason) => { setUnitStatus(code, status, reason); setOpenCode(null); }}
        />
      )}
    </div>
  );
}
