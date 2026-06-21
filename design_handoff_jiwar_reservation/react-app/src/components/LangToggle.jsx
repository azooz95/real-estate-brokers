import { useI18n } from '../i18n/I18nContext.jsx';
import { color } from '../theme/tokens.js';

// Floating EN / العربية switch. Shared by both sites; each site has its own
// I18nProvider, so toggling here only changes the current product's language.
export default function LangToggle() {
  const { lang, setLang } = useI18n();
  const btn = (active) => ({
    border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, fontSize: 12,
    fontWeight: active ? 700 : 500,
    background: active ? color.accentRose : 'rgba(0,0,0,.06)',
    color: active ? '#3f0209' : color.inkSoft,
  });
  return (
    <div style={{ position: 'fixed', bottom: 18, insetInlineEnd: 18, zIndex: 100, display: 'flex', gap: 4,
      background: '#fff', padding: 4, borderRadius: 10, boxShadow: '0 6px 18px rgba(0,0,0,.12)' }}>
      <button style={btn(lang === 'en')} onClick={() => setLang('en')}>EN</button>
      <button style={btn(lang === 'ar')} onClick={() => setLang('ar')}>العربية</button>
    </div>
  );
}
