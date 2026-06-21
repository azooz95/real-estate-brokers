import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { api } from '../../api/client.js';
import { color, shadow } from '../../theme/tokens.js';
import ReceiptPanel from './ReceiptPanel.jsx';

const fmt = (n) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(n);

const TX_COLUMNS = ['ts', 'ref', 'client', 'phone', 'project', 'unit', 'deposit', 'broker'];

function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCsv(rows) {
  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [TX_COLUMNS.join(','), ...rows.map((r) => TX_COLUMNS.map((c) => escape(r[c])).join(','))];
  downloadBlob(lines.join('\n'), `transactions-${Date.now()}.csv`, 'text/csv;charset=utf-8;');
}

function exportExcel(rows) {
  const escape = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const head = TX_COLUMNS.map((c) => `<th>${c}</th>`).join('');
  const body = rows.map((r) => `<tr>${TX_COLUMNS.map((c) => `<td>${escape(r[c])}</td>`).join('')}</tr>`).join('');
  const html = `<html><head><meta charset="utf-8" /></head><body><table border="1"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></body></html>`;
  downloadBlob(html, `transactions-${Date.now()}.xls`, 'application/vnd.ms-excel');
}

export default function Transactions() {
  const { t } = useI18n();
  const [rows, setRows] = useState([]);
  const [openRef, setOpenRef] = useState(null);   // transaction shown in the receipt panel
  useEffect(() => { api.listTransactions().then(setRows); }, []);
  const openTx = rows.find((r) => r.ref === openRef) || null;

  const th = { textAlign: 'start', padding: '13px 18px', fontSize: 10, fontWeight: 700, color: color.inkMuted, letterSpacing: '.05em' };
  const td = { padding: '15px 18px', fontSize: 13, color: color.ink };

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysDeposit = rows.filter((r) => r.ts.startsWith(todayStr)).reduce((s, r) => s + r.deposit, 0);
  const brokerCounts = rows.reduce((acc, r) => { acc[r.broker] = (acc[r.broker] ?? 0) + 1; return acc; }, {});
  const leader = Object.entries(brokerCounts).sort((a, b) => b[1] - a[1])[0];

  const widgets = [
    { label: t('daily_volume'), value: `SAR ${fmt(todaysDeposit)}`, sub: `${rows.filter((r) => r.ts.startsWith(todayStr)).length} reservations today`, subColor: color.emeraldText },
    { label: 'ACTIVE RESERVATIONS', value: `${rows.length} Units`, sub: 'All confirmed', subColor: color.primary },
    { label: 'MARKETER LEADER', value: leader ? leader[0] : '—', sub: leader ? `${leader[1]} closures` : 'No data yet', subColor: color.inkSoft },
    { label: t('audit_health'), value: '100%', sub: 'All records reconciled', subColor: color.emeraldSoft, dark: true },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: color.ink }}>{t('tx_ledger')}</div>
          <div style={{ fontSize: 14, color: color.inkMuted, marginTop: 4, maxWidth: 520, lineHeight: 1.5 }}>{t('tx_sub')}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => exportCsv(rows)} style={{ background: '#fff', color: color.primary, border: '1px solid #e3dde1', borderRadius: 8, padding: '10px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>⬇ {t('export_csv')}</button>
          <button onClick={() => exportExcel(rows)} style={{ background: color.emerald, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>⬇ {t('export_excel')}</button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, marginTop: 20, overflow: 'auto', boxShadow: shadow.soft }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 880 }}>
          <thead>
            <tr style={{ background: color.surfaceAlt }}>
              <th style={th}>{t('th_timestamp')}</th>
              <th style={th}>{t('th_ref')}</th>
              <th style={th}>{t('th_client')}</th>
              <th style={th}>{t('th_property')}</th>
              <th style={{ ...th, textAlign: 'end' }}>{t('th_deposit')}</th>
              <th style={th}>{t('th_marketer')}</th>
              <th style={{ ...th, textAlign: 'center' }}>{t('th_receipt')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.ref} style={{ borderTop: `1px solid ${color.lineSoft}` }}>
                <td style={{ ...td, color: color.inkSoft, fontSize: 12, whiteSpace: 'nowrap' }}>{r.ts}</td>
                <td style={{ ...td, fontWeight: 700, color: color.primary, fontSize: 12 }}>#{r.ref}</td>
                <td style={td}>
                  <div style={{ fontWeight: 600 }}>{r.client}</div>
                  <div style={{ fontSize: 11, color: color.inkMuted }}>{r.phone}</div>
                </td>
                <td style={td}>
                  <div>{r.project}</div>
                  <div style={{ fontSize: 11, color: color.inkMuted }}>{r.unit}</div>
                </td>
                <td style={{ ...td, textAlign: 'end', fontWeight: 600, color: color.emerald }}>{fmt(r.deposit)}</td>
                <td style={{ ...td, color: color.gold }}>{r.broker}</td>
                <td style={{ ...td, textAlign: 'center' }}><button onClick={() => setOpenRef(r.ref)} style={{ background: color.bgWarm, border: '1px solid #ece4e6', borderRadius: 6, color: color.primary, fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '6px 12px' }}>📄 {t('view_receipt')}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginTop: 20 }}>
        {widgets.map((w) => (
          <div key={w.label} style={{ background: w.dark ? color.emerald : '#fff', borderRadius: 12, padding: '18px 20px', boxShadow: shadow.soft }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: w.dark ? color.emeraldSoft : color.inkMuted, letterSpacing: '.05em' }}>{w.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: w.dark ? '#fff' : color.ink, marginTop: 8 }}>{w.value}</div>
            <div style={{ fontSize: 12, color: w.subColor, marginTop: 4 }}>{w.sub}</div>
          </div>
        ))}
      </div>

      {openTx && <ReceiptPanel tx={openTx} onClose={() => setOpenRef(null)} />}
    </div>
  );
}
