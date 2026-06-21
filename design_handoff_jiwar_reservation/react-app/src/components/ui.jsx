// Shared UI primitives + helpers used across screens.
import { color, radius, shadow, font } from '../theme/tokens.js';

export const SAR = (n) =>
  'SAR ' + new Intl.NumberFormat('en-US').format(n);

// Share a unit via the device share sheet, falling back to clipboard copy.
export function shareUnit(label, lang = 'en') {
  const data = { title: `${label} — Jiwar Aloula`, text: 'Check out this unit at Jiwar Aloula', url: window.location.href };
  if (navigator.share) navigator.share(data).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(() => alert(lang === 'ar' ? 'تم نسخ رابط الوحدة' : 'Unit link copied to clipboard'));
}

// Circular share button overlaid on a card image (top-trailing corner).
export function ShareButton({ onClick, overlay = true }) {
  const base = { width: 36, height: 36, display: 'grid', placeItems: 'center', border: 'none', borderRadius: '50%',
    color: color.primaryHover, fontSize: 16, cursor: 'pointer' };
  const pos = overlay
    ? { position: 'absolute', top: 12, insetInlineEnd: 12, background: 'rgba(255,255,255,.92)', boxShadow: '0 2px 6px rgba(0,0,0,.18)' }
    : { background: color.bgWarm, border: '1px solid #ece0e4' };
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }} aria-label="Share apartment" style={{ ...base, ...pos }}>⤴</button>
  );
}

// Status → pill palette. One mapping shared by client + admin so a unit's
// status always reads the same colour everywhere.
const STATUS = {
  available: { bg: color.emeraldChipBg, fg: color.emeraldText, label: 'AVAILABLE' },
  hold:      { bg: color.amberChipBg,   fg: color.amber,       label: 'HOLD' },
  reserved:  { bg: color.slateChipBg,   fg: color.slateText,   label: 'RESERVED' },
  confirmed: { bg: color.emerald,       fg: color.emeraldMint, label: 'CONFIRMED' },
};

export function StatusBadge({ status, children, style }) {
  const s = STATUS[status] || STATUS.available;
  return (
    <span style={{ display: 'inline-block', background: s.bg, color: s.fg, fontSize: 11,
      fontWeight: 700, letterSpacing: '.05em', padding: '4px 10px', borderRadius: radius.pill, ...style }}>
      {children || s.label}
    </span>
  );
}

// Centered mobile phone frame used by every client screen. On an actual phone
// viewport (<=480px) the decorative frame drops away to a full-bleed page —
// the frame is a desktop preview device, not the real mobile layout.
export function PhoneFrame({ children, bg = color.bgWarm }) {
  return (
    <div className="phone-shell" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '28px 16px 80px', background: '#e7e3e6' }}>
      <div className="phone-scroll phone-card" style={{ width: 390, maxWidth: '100%', background: bg, borderRadius: 30, overflow: 'hidden',
        boxShadow: shadow.phone, position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}

export function PhoneHeader({ onBack, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
      padding: '0 16px', background: color.bgWarm, position: 'sticky', top: 0, zIndex: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {onBack ? (
          <button onClick={onBack} style={{ width: 40, height: 40, border: 'none', background: 'transparent',
            color: color.primary, fontSize: 18, cursor: 'pointer' }}>‹</button>
        ) : (
          <div style={{ width: 40, height: 40, display: 'grid', placeItems: 'center', color: color.primary, fontSize: 20 }}>☰</div>
        )}
        <img src="/assets/img/86442120d5.png" alt="Jiwar Aloula" style={{ height: 30 }} />
      </div>
      {right}
    </div>
  );
}

export const card = { background: color.surface, borderRadius: radius.lg, boxShadow: shadow.soft };
export const sectionTitle = { fontSize: 24, fontWeight: 700, color: color.ink };
