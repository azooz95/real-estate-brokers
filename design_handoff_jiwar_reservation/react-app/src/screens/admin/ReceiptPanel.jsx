import { useI18n } from '../../i18n/I18nContext.jsx';
import { color } from '../../theme/tokens.js';

// Slide-in receipt panel for the Transactions ledger. `tx` is a transaction row
// (see data/fixtures.js → transactions). In production fetch the full receipt
// via GET /api/transactions/:ref/receipt; here we render straight from the row.
export default function ReceiptPanel({ tx, onClose }) {
  const { t } = useI18n();
  const initials = tx.broker.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const lbl = { fontSize: 11, fontWeight: 700, color: color.inkMuted, letterSpacing: '.06em', paddingBottom: 10, borderBottom: `1px solid ${color.lineSoft}` };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(20,8,12,.5)', display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'relative', width: 540, maxWidth: '94vw', height: '100%', background: color.bgAdmin, boxShadow: '-20px 0 60px -20px rgba(0,0,0,.4)', overflow: 'auto', animation: 'slideIn .28s ease both' }}>
        {/* toolbar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 2, display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px', background: '#e9e5e7' }}>
          <button onClick={onClose} style={{ width: 32, height: 32, border: 'none', background: 'transparent', fontSize: 20, color: color.ink, cursor: 'pointer' }}>✕</button>
          <span style={{ fontSize: 18, fontWeight: 700, color: color.ink }}>{t('receipt_view')}</span>
          <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', color: color.primary, fontSize: 12, fontWeight: 700, letterSpacing: '.04em', cursor: 'pointer' }}>🖨 {t('receipt_print')}</button>
            <button onClick={() => window.open(`/api/reservations/${tx.ref}/receipt/pdf`, '_blank')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: color.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 12, fontWeight: 700, letterSpacing: '.04em', cursor: 'pointer' }}>⬇ {t('receipt_download')}</button>
          </div>
        </div>

        {/* document */}
        <div style={{ background: '#fff' }}>
          <div style={{ height: 4, background: color.primary }} />
          <div style={{ position: 'relative', padding: 32, background: 'linear-gradient(180deg, #faf3f4, #fff)' }}>
            <img src="/assets/img/86442120d5.png" alt="Jiwar Aloula" style={{ height: 26 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 28 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: color.emerald, fontSize: 12, fontWeight: 700, letterSpacing: '.04em' }}>✓ {t('receipt_verified')}</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: color.ink, marginTop: 10, lineHeight: 1.1 }}>{t('reservation_receipt_title')}</div>
                <div style={{ fontSize: 13, color: color.inkSoft, marginTop: 8 }}>{t('reference_label')} <span style={{ fontWeight: 700, color: color.ink }}>#{tx.ref}</span> • {tx.ts.slice(0, 10)}</div>
              </div>
              <div style={{ textAlign: 'end', fontSize: 13, color: color.inkSoft, lineHeight: 1.7 }}>
                <div style={{ fontWeight: 700, color: color.primary, letterSpacing: '.05em', fontSize: 12 }}>{t('heritage_excellence')}</div>
                <div>{t('rec_dev_addr1')}</div><div>{t('rec_dev_addr2')}</div><div>{t('rec_dev_addr3')}</div>
              </div>
            </div>
            <div style={{ height: 1, background: '#efdfe1', marginTop: 24 }} />
          </div>

          <div style={{ padding: '0 32px 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
              <div>
                <div style={lbl}>{t('client_details')}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: color.ink, marginTop: 16 }}>{tx.client}</div>
                <div style={{ fontSize: 13, color: color.inkSoft, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span>📞 {tx.phone}</span><span>✉ {tx.client.toLowerCase().replace(/[^a-z]/g, '.')}@example.com</span>
                </div>
              </div>
              <div>
                <div style={lbl}>{t('property_information')}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: color.ink, marginTop: 16 }}>{tx.unit}</div>
                <div style={{ fontSize: 13, color: color.inkSoft, marginTop: 8 }}>{tx.project}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: color.lineSoft, borderRadius: 6, padding: '5px 10px', fontSize: 13, color: color.ink }}>🛏 3</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: color.lineSoft, borderRadius: 6, padding: '5px 10px', fontSize: 13, color: color.ink }}>🛁 2</span>
                </div>
              </div>
            </div>

            <div style={{ ...lbl, marginTop: 32 }}>{t('financial_breakdown')}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
              <span style={{ fontSize: 15, color: color.ink }}>{t('initial_deposit')}</span>
              <span style={{ fontSize: 15, color: color.ink }}>{tx.deposit.toLocaleString('en-US', { minimumFractionDigits: 2 })} SAR</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <span style={{ fontSize: 15, color: color.ink }}>{t('admin_fees')}</span>
              <span style={{ fontSize: 15, color: color.emerald, fontWeight: 600 }}>{t('included')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, background: '#f6ecee', borderRadius: 10, padding: 24, marginTop: 24 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: color.ink, letterSpacing: '.04em' }}>{t('total_paid')}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 12, fontWeight: 700, color: color.primary, letterSpacing: '.04em' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: color.primary }} />{t('transaction_completed')}</div>
              </div>
              <div style={{ textAlign: 'end' }}>
                <div style={{ fontSize: 30, fontWeight: 700, color: color.primary, lineHeight: 1 }}>{tx.deposit.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span style={{ fontSize: 16 }}>SAR</span></div>
                <div style={{ fontSize: 12, color: '#9a7a7e', marginTop: 6 }}>Five Thousand Saudi Riyals Only</div>
              </div>
            </div>

            <div style={{ height: 1, background: color.lineSoft, margin: '28px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 20, alignItems: 'start' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: color.inkMuted, letterSpacing: '.06em' }}>{t('assigned_agent')}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#f6d9d9', color: color.primary, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>{initials}</div>
                  <span style={{ fontSize: 15, color: color.ink }}>{tx.broker}</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: color.placeholder, lineHeight: 1.6, textAlign: 'end' }}>{t('receipt_legal')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
