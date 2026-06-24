import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { api } from '../../api/client.js';
import { color, shadow } from '../../theme/tokens.js';
import { useToast } from '../../components/Toast.jsx';

export default function Settings() {
  const { t } = useI18n();
  const toast = useToast();
  const [s, setS] = useState(null);
  const [me, setMe] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { api.getSettings().then(setS); }, []);
  useEffect(() => { api.getMe().then(setMe); }, []);
  if (!s) return null;

  const set = (patch) => setS({ ...s, ...patch });
  const setIntegration = (key, v) => setS({ ...s, integrations: { ...s.integrations, [key]: v } });

  async function saveSettings() {
    setSaving(true);
    try {
      const updated = await api.saveSettings(s);
      setS(updated);
      toast.success('Settings saved.');
    } catch {
      toast.error('Could not save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function cancelSettings() {
    try {
      setS(await api.getSettings());
    } catch {
      toast.error('Could not reload settings.');
    }
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: color.ink }}>{t('sys_settings')}</div>
      <div style={{ fontSize: 14, color: color.inkMuted, marginTop: 4 }}>{t('sys_settings_sub')}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>
        {/* Financial */}
        <Panel title="Financial Parameters">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 18 }}>
            <NumField label="Reservation Deposit (SAR)" value={s.reservationDeposit} onChange={(v) => set({ reservationDeposit: v })} />
            <NumField label="VAT Rate (%)" value={s.vatRate} onChange={(v) => set({ vatRate: v })} />
            <NumField label="Reservation Hold Window (min)" value={s.holdWindowMinutes} onChange={(v) => set({ holdWindowMinutes: v })} />
            <TextField label="Default Currency" value="SAR — Saudi Riyal" />
          </div>
        </Panel>

        {/* Integrations */}
        <Panel title="Integrations & Notifications">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
            <Toggle label="Payment Gateway (mada / STC Pay)" sub="Live keys connected" on={s.integrations.paymentGateway} onChange={(v) => setIntegration('paymentGateway', v)} />
            <Toggle label="SMS Reservation Alerts" sub="Notify marketers on each reservation" on={s.integrations.smsAlerts} onChange={(v) => setIntegration('smsAlerts', v)} />
            <Toggle label="Bilingual Receipts (AR / EN)" sub="Attach both languages to PDF" on={s.integrations.bilingualReceipts} onChange={(v) => setIntegration('bilingualReceipts', v)} />
          </div>
        </Panel>

        {/* Account & security */}
        <AccountPanel me={me} onUpdated={setMe} />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={cancelSettings} disabled={saving} style={{ background: '#fff', color: color.inkSoft, border: '1px solid #e3dde1', borderRadius: 8, padding: '12px 22px', fontSize: 14, fontWeight: 600, cursor: saving ? 'default' : 'pointer' }}>Cancel</button>
          <button onClick={saveSettings} disabled={saving}
            style={{ background: color.primaryHover, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : t('save_changes')}
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountPanel({ me, onUpdated }) {
  const [form, setForm] = useState({ currentPassword: '', newEmail: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }
  const [saving, setSaving] = useState(false);

  async function submit() {
    setStatus(null);
    if (!form.currentPassword) {
      setStatus({ type: 'error', message: 'Enter your current password to confirm this change.' });
      return;
    }
    if (!form.newEmail && !form.newPassword) {
      setStatus({ type: 'error', message: 'Enter a new email or a new password.' });
      return;
    }
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }
    setSaving(true);
    try {
      const { user } = await api.updateAccount({
        currentPassword: form.currentPassword,
        newEmail: form.newEmail || undefined,
        newPassword: form.newPassword || undefined,
      });
      onUpdated(user);
      setForm({ currentPassword: '', newEmail: '', newPassword: '', confirmPassword: '' });
      setStatus({ type: 'success', message: 'Account updated.' });
    } catch (e) {
      setStatus({ type: 'error', message: e.message.includes('401') ? 'Current password is incorrect.' : e.message.includes('409') ? 'That email is already in use.' : 'Could not update account.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel title="Account & Security">
      <div style={{ fontSize: 12, color: color.inkMuted, marginTop: 4 }}>Signed in as <strong>{me?.email ?? '…'}</strong></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 18 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: color.inkMuted }}>New Login Email</div>
          <input type="email" value={form.newEmail} placeholder={me?.email}
            onChange={(e) => setForm({ ...form, newEmail: e.target.value })} style={fieldBox} />
        </div>
        <div />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: color.inkMuted }}>New Password</div>
          <input type="password" value={form.newPassword} placeholder="Leave blank to keep current"
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })} style={fieldBox} />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: color.inkMuted }}>Confirm New Password</div>
          <input type="password" value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} style={fieldBox} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: color.inkMuted }}>Current Password (required to confirm)</div>
          <input type="password" value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} style={fieldBox} />
        </div>
      </div>
      {status && (
        <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600, color: status.type === 'success' ? color.emeraldText : color.primary }}>
          {status.message}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <button onClick={submit} disabled={saving}
          style={{ background: color.primaryHover, color: '#fff', border: 'none', borderRadius: 8, padding: '11px 20px', fontSize: 13, fontWeight: 600, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Updating…' : 'Update Account'}
        </button>
      </div>
    </Panel>
  );
}

function Panel({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: shadow.soft }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: color.ink, paddingBottom: 14, borderBottom: `1px solid ${color.lineSoft}` }}>{title}</div>
      {children}
    </div>
  );
}
const fieldBox = { background: color.surfaceAlt, border: `1px solid ${color.line}`, borderRadius: 8, padding: '12px 14px', marginTop: 6, color: color.ink, fontSize: 14, fontWeight: 600, width: '100%', outline: 'none' };
function NumField({ label, value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: color.inkMuted }}>{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={fieldBox} />
    </div>
  );
}
function TextField({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: color.inkMuted }}>{label}</div>
      <div style={fieldBox}>{value}</div>
    </div>
  );
}
function Toggle({ label, sub, on, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: color.ink }}>{label}</div>
        <div style={{ fontSize: 12, color: color.inkMuted, marginTop: 2 }}>{sub}</div>
      </div>
      <button onClick={() => onChange(!on)} aria-pressed={on}
        style={{ width: 42, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: on ? color.emerald : '#cfcacd', position: 'relative' }}>
        <span style={{ position: 'absolute', top: 3, [on ? 'insetInlineEnd' : 'insetInlineStart']: 3, width: 18, height: 18, borderRadius: '50%', background: '#fff' }} />
      </button>
    </div>
  );
}
