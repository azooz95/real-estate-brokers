import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { api } from '../../api/client.js';
import * as mock from '../../data/fixtures.js';
import { color, radius, shadow } from '../../theme/tokens.js';
import { PhoneFrame, PhoneHeader } from '../../components/ui.jsx';
import { getTrackingRef } from '../../lib/trackingRef.js';

export default function Reserve() {
  const { t } = useI18n();
  const nav = useNavigate();
  const { unitId } = useParams();
  const [unit, setUnit] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', paymentMethod: 'mada' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { api.getUnit(unitId).then(setUnit); }, [unitId]);

  // brokerRef comes from the tracking link the client originally arrived on
  // (?ref=ID-xxxx), persisted for the session since it's long gone from this
  // page's own URL by the time the client reaches Reserve.
  const brokerRef = getTrackingRef();

  async function submit() {
    setSubmitting(true);
    const res = await api.createReservation({ unitId, brokerRef, client: form, paymentMethod: form.paymentMethod });
    nav(`/reservation/${res.id}/success`);
  }

  return (
    <PhoneFrame>
      <PhoneHeader onBack={() => nav(-1)} />
      <div style={{ padding: '16px 16px 120px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Summary */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 17 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 600, color: color.primaryHover }}>{unit?.title ?? '—'}</div>
              <div style={{ fontSize: 16, color: color.inkSoft, marginTop: 4 }}>{t('unit')}: {unit?.code ?? '—'}</div>
            </div>
            <div style={{ background: color.line, borderRadius: 4, padding: '8px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 16, color: color.inkSoft }}>{t('floor')}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: color.ink }}>{unit?.floor ?? '—'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTop: '1px solid #eee' }}>
            <div style={{ fontSize: 16, color: color.inkSoft }}>{t('reservation_deposit')}</div>
            <div style={{ fontSize: 16, color: color.primaryHover, fontWeight: 600 }}>{unit ? `SAR ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(unit.deposit)}` : '—'}</div>
          </div>
        </div>

        {/* Countdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: color.goldSoft, borderRadius: 8, padding: 16 }}>
          <span style={{ fontSize: 20 }}>⏳</span>
          <span style={{ fontSize: 16, color: color.goldText }}>{t('holding_unit')} 09:59 {t('minutes')}</span>
        </div>

        {/* Personal info */}
        <div>
          <div style={{ fontSize: 20, fontWeight: 600, color: color.ink }}>{t('personal_information')}</div>
          <Field label={t('full_name')}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('enter_full_name')} style={inputStyle} />
          </Field>
          <Field label={t('phone_number')}>
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'grid', placeItems: 'center', background: '#f5f3f5', border: `1px solid ${color.line}`,
                borderInlineEnd: 'none', borderRadius: '8px 0 0 8px', padding: '0 16px', color: color.inkSoft, fontSize: 16 }}>+966</div>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="5X XXX XXXX" style={{ ...inputStyle, borderRadius: '0 8px 8px 0', flex: 1 }} />
            </div>
          </Field>
        </div>

        {/* Payment */}
        <div>
          <div style={{ fontSize: 20, fontWeight: 600, color: color.ink }}>{t('select_payment')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
            {mock.paymentMethods.map((p) => {
              const active = form.paymentMethod === p.id;
              return (
                <button key={p.id} onClick={() => setForm({ ...form, paymentMethod: p.id })}
                  style={{ background: '#fff', border: `1px solid ${active ? color.primaryHover : color.line}`, borderRadius: 8,
                    padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer',
                    boxShadow: active ? '0 0 0 2px rgba(103,31,35,.15)' : 'none' }}>
                  <img src={p.icon} alt={p.label} style={{ width: 26, height: 26, objectFit: 'contain' }} />
                  <span style={{ fontSize: 16, color: color.inkSoft }}>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ position: 'sticky', bottom: 0, padding: 16, background: color.bgWarm, borderTop: '1px solid #eee' }}>
        <button onClick={submit} disabled={submitting}
          style={{ width: '100%', background: color.primaryHover, color: '#fff', border: 'none', borderRadius: 12, padding: 16,
            fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: shadow.lift, opacity: submitting ? 0.7 : 1 }}>
          {t('proceed_payment')}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 12, color: color.inkSoft, fontSize: 14 }}>
          <span>🔒</span>{t('ssl_note')}
        </div>
      </div>
    </PhoneFrame>
  );
}

const inputStyle = {
  width: '100%', background: '#fff', border: `1px solid ${color.line}`, borderRadius: 8,
  padding: '18px 16px', marginTop: 4, color: color.ink, fontSize: 16, outline: 'none',
};
function Field({ label, children }) {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 16, color: color.inkSoft }}>{label}</div>
      {children}
    </div>
  );
}
