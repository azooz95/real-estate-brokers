import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { api } from '../../api/client.js';
import { color, shadow } from '../../theme/tokens.js';

const SAR = (n) => 'SAR ' + new Intl.NumberFormat('en-US').format(n);
const sarShort = (n) => n >= 1_000_000 ? `SAR ${(n / 1_000_000).toFixed(1)}M` : SAR(Math.round(n));
const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('');

export default function Marketers() {
  const { t, lang } = useI18n();
  const [brokers, setBrokers] = useState([]);
  const [form, setForm] = useState({ fullName: '', mobile: '' });
  const [creating, setCreating] = useState(false);
  const [justCreated, setJustCreated] = useState(null);
  const [editing, setEditing] = useState(null); // broker being edited in the modal
  useEffect(() => { api.listBrokers().then(setBrokers); }, []);

  async function generateLink() {
    if (!form.fullName.trim() || !form.mobile.trim()) return;
    setCreating(true);
    try {
      const broker = await api.createBroker(form);
      setBrokers((prev) => [broker, ...prev]);
      setJustCreated(broker);
      setForm({ fullName: '', mobile: '' });
    } finally {
      setCreating(false);
    }
  }

  const activeCount = brokers.filter((b) => b.status !== 'suspended').length;

  const th = { padding: '12px 20px', fontSize: 10, fontWeight: 700, color: color.inkMuted, letterSpacing: '.05em' };

  return (
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: color.ink }}>{t('marketer_mgmt')}</div>
      <div style={{ fontSize: 14, color: color.inkMuted, marginTop: 4 }}>{t('marketer_mgmt_sub')}</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginTop: 20, alignItems: 'start' }}>
        {/* Roster */}
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: shadow.soft }}>
          <div style={{ padding: '18px 20px', fontSize: 16, fontWeight: 700, color: color.ink, borderBottom: `1px solid ${color.lineSoft}` }}>{t('active_roster')}</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: color.surfaceAlt }}>
                <th style={{ ...th, textAlign: 'start' }}>{t('th_broker')}</th>
                <th style={{ ...th, textAlign: 'start' }}>{t('th_url')}</th>
                <th style={{ ...th, textAlign: 'center' }}>{t('th_clicks')}</th>
                <th style={{ ...th, textAlign: 'center' }}>{t('th_units')}</th>
                <th style={{ ...th, textAlign: 'end' }}>{t('th_revenue')}</th>
                <th style={{ ...th, textAlign: 'center' }}>Status</th>
                <th style={{ ...th, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brokers.map((b) => {
                const suspended = b.status === 'suspended';
                return (
                <tr key={b.id} style={{ borderTop: `1px solid ${color.lineSoft}`, opacity: suspended ? 0.6 : 1 }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: color.primaryHover, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>{initials(b.name)}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: color.ink }}>{b.name}</div>
                        <div style={{ fontSize: 11, color: color.inkMuted }}>{b.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 12, color: color.gold, background: '#f5f2f4', padding: '4px 8px', borderRadius: 4 }}>{b.trackingUrl}</span></td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 13, color: color.ink }}>{b.clicks.toLocaleString()}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{ background: b.unitsReserved >= 5 ? color.emeraldMint : color.amberFill, color: b.unitsReserved >= 5 ? '#174f45' : color.goldText, fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 12 }}>{b.unitsReserved} Units</span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'end', fontSize: 13, fontWeight: 700, color: color.emerald }}>{SAR(b.revenue)}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{ background: suspended ? '#f3d9d9' : color.emeraldMint, color: suspended ? color.primary : '#174f45', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12, letterSpacing: '.03em' }}>
                      {suspended ? 'SUSPENDED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <button onClick={() => setEditing(b)} title="Manage broker" aria-label="Manage broker"
                      style={{ width: 32, height: 32, display: 'inline-grid', placeItems: 'center', background: color.bgWarm, color: color.primaryHover, border: '1px solid #ece4e6', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>⚙</button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: '14px 20px', fontSize: 12, color: color.inkMuted, borderTop: `1px solid ${color.lineSoft}` }}>
            {lang === 'ar' ? `عرض ${brokers.length} مسوّقًا (${activeCount} نشط)` : `Showing ${brokers.length} marketers (${activeCount} active)`}
          </div>
        </div>

        {/* Onboard + stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 22, boxShadow: shadow.soft }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: color.ink }}>{t('onboard_broker')}</div>
            <FormField label={t('broker_full_name')} value={form.fullName} placeholder="e.g. Mohammed Al-Fares" onChange={(v) => setForm({ ...form, fullName: v })} />
            <FormField label={t('mobile_number')} value={form.mobile} placeholder="+966 5X XXX XXXX" onChange={(v) => setForm({ ...form, mobile: v })} />
            <button onClick={generateLink} disabled={creating} style={{ width: '100%', marginTop: 18, background: color.primaryHover, color: '#fff', border: 'none', borderRadius: 8, padding: 13, fontSize: 12, fontWeight: 700, letterSpacing: '.04em', cursor: creating ? 'default' : 'pointer', opacity: creating ? 0.7 : 1 }}>🔗 {creating ? '…' : t('generate_link')}</button>
            {justCreated && (
              <div style={{ marginTop: 14, background: color.bgWarm, border: `1px solid ${color.line}`, borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: color.emeraldText, letterSpacing: '.05em' }}>✓ LINK GENERATED for {justCreated.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span style={{ flex: 1, fontSize: 12, color: color.gold, background: '#f5f2f4', padding: '6px 8px', borderRadius: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{justCreated.trackingUrl}</span>
                  <button onClick={() => navigator.clipboard?.writeText(justCreated.trackingUrl)} style={{ border: 'none', background: color.primary, color: '#fff', borderRadius: 4, padding: '6px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Copy</button>
                </div>
              </div>
            )}
          </div>
          <div style={{ background: color.primary, borderRadius: 12, padding: 22, color: '#fff' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: color.accentRose, letterSpacing: '.05em' }}>{t('quick_stats')}</div>
            <Stat label={t('active_marketers')} value={String(activeCount)} />
            <Stat label={t('total_revenue_mtd')} value={brokers.length ? sarShort(brokers.reduce((s, b) => s + b.revenue, 0)) : 'SAR 0'} valueColor={color.goldSoft} divider />
          </div>
        </div>
      </div>

      {editing && (
        <BrokerEditModal
          broker={editing}
          onClose={() => setEditing(null)}
          onChange={(updated) => {
            setBrokers((prev) => prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b)));
            setEditing((prev) => ({ ...prev, ...updated }));
          }}
          onDeleted={(id) => {
            setBrokers((prev) => prev.filter((b) => b.id !== id));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function BrokerEditModal({ broker, onClose, onChange, onDeleted }) {
  const [mobile, setMobile] = useState(broker.mobile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const suspended = broker.status === 'suspended';

  async function save() {
    setSaving(true);
    try {
      const updated = await api.updateBroker(broker.id, { mobile });
      onChange({ ...broker, ...updated });
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } finally {
      setSaving(false);
    }
  }

  async function toggleSuspend() {
    setSaving(true);
    try {
      const updated = await api.updateBroker(broker.id, { status: suspended ? 'active' : 'suspended' });
      onChange({ ...broker, ...updated });
    } finally {
      setSaving(false);
    }
  }

  async function confirmAndDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await api.deleteBroker(broker.id);
      onDeleted(broker.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(20,8,12,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 440, background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 50px 120px -30px rgba(0,0,0,.6)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: color.ink }}>{broker.name}</div>
            <div style={{ fontSize: 12, color: color.inkMuted, marginTop: 2 }}>{broker.id}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, border: 'none', background: 'transparent', color: color.inkSoft, fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: color.inkMuted, letterSpacing: '.05em' }}>TRACKING LINK</div>
          <div style={{ fontSize: 12, color: color.gold, background: '#f5f2f4', padding: '8px 10px', borderRadius: 6, marginTop: 6, wordBreak: 'break-all' }}>{broker.trackingUrl}</div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: color.inkMuted, letterSpacing: '.05em' }}>MOBILE NUMBER</div>
          <input value={mobile} onChange={(e) => setMobile(e.target.value)}
            style={{ width: '100%', background: color.surfaceAlt, border: `1px solid ${color.line}`, borderRadius: 8, padding: '12px 14px', marginTop: 6, color: color.ink, fontSize: 14, outline: 'none' }} />
        </div>

        <button onClick={save} disabled={saving || mobile === broker.mobile}
          style={{ width: '100%', marginTop: 14, background: saved ? color.emerald : color.primaryHover, color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 700, cursor: saving || mobile === broker.mobile ? 'default' : 'pointer', opacity: saving || mobile === broker.mobile ? 0.6 : 1 }}>
          {saved ? '✓ Saved' : 'Save Phone Number'}
        </button>

        <div style={{ height: 1, background: color.lineSoft, margin: '20px 0' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: color.ink }}>{suspended ? 'Broker is suspended' : 'Broker is active'}</div>
            <div style={{ fontSize: 12, color: color.inkMuted, marginTop: 2 }}>{suspended ? 'Their tracking link no longer attributes reservations.' : 'Suspending disables their tracking link.'}</div>
          </div>
          <button onClick={toggleSuspend} disabled={saving}
            style={{ background: suspended ? color.emerald : '#fff', color: suspended ? '#fff' : color.primary, border: suspended ? 'none' : '1px solid #e3dde1', borderRadius: 8, padding: '9px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {suspended ? 'Reactivate' : 'Suspend'}
          </button>
        </div>

        <div style={{ height: 1, background: color.lineSoft, margin: '20px 0' }} />

        <button onClick={confirmAndDelete} disabled={deleting}
          style={{ width: '100%', background: confirmDelete ? color.primary : '#fff', color: confirmDelete ? '#fff' : color.primary, border: `1px solid ${color.primary}`, borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          {confirmDelete ? 'Click again to confirm permanent delete' : '🗑 Delete Broker'}
        </button>
      </div>
    </div>
  );
}

function FormField({ label, value, placeholder, onChange }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: color.inkMuted, letterSpacing: '.05em' }}>{label}</div>
      <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', background: color.surfaceAlt, border: `1px solid ${color.line}`, borderRadius: 8, padding: '12px 14px', marginTop: 6, color: color.ink, fontSize: 14, outline: 'none' }} />
    </div>
  );
}
function Stat({ label, value, valueColor, divider }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: divider ? 12 : 16, paddingTop: divider ? 12 : 0, borderTop: divider ? '1px solid rgba(255,255,255,.12)' : 'none' }}>
      <span style={{ color: 'rgba(255,255,255,.7)', fontSize: 13 }}>{label}</span>
      <span style={{ fontSize: 22, fontWeight: 700, color: valueColor || '#fff' }}>{value}</span>
    </div>
  );
}
