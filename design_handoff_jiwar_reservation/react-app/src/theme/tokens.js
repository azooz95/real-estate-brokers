// ============================================================================
// JIWAR ALOULA — Design Tokens
// Extracted directly from the Figma source. These are the single source of
// truth for color, type, spacing, radius and shadow across the app.
// ============================================================================

export const color = {
  // Brand / burgundy
  primary:      '#4A0810', // deep maroon — primary buttons, headings, sidebar accents
  primaryHover: '#671F23', // hero panels, reserve CTA, active states
  accentRose:   '#EA8586', // light rose — accents on dark surfaces

  // Gold / sand
  gold:         '#725A40', // secondary text accent, links
  goldSoft:     '#BB9E80', // sand fills, countdown banner
  goldFill:     '#FBDAB9', // pale gold chips ("AVAILABLE" on detail)
  goldText:     '#58432A',

  // Success / emerald (available units, confirmed status)
  emerald:      '#004036',
  emeraldSoft:  '#76AC9E',
  emeraldMint:  '#B6EEDF',
  emeraldText:  '#15803D',
  emeraldChipBg:'#DCF3E9',

  // Status — hold / amber
  amber:        '#D97706',
  amberChipBg:  '#FDEBD2',
  amberFill:    '#FEDDBC',

  // Neutrals
  ink:          '#1B1B1D', // primary text
  inkSoft:      '#544242', // secondary text (warm grey)
  inkMuted:     '#877271', // tertiary / labels
  placeholder:  '#9B9398',
  line:         '#EAE7EA', // borders
  lineSoft:     '#F1EDF0',
  surface:      '#FFFFFF',
  surfaceAlt:   '#FAF8FA', // input fills
  bgWarm:       '#FBF8FB', // client app background
  bgStone:      '#F2F1ED', // unit detail/list background
  bgAdmin:      '#F4F1F3', // admin content background
  sidebar:      '#1F1F21', // admin sidebar
  sidebarItem:  '#E4E2E4',

  // Slate status (reserved)
  slateChipBg:  '#E7EAEF',
  slateText:    '#64748B',
};

export const font = {
  // Latin / default
  sans:   "'Inter', sans-serif",
  // Arabic — applied automatically when dir="rtl"
  arabic: "'IBM Plex Sans Arabic', 'Inter', sans-serif",
};

// Type scale (px). Client = mobile, Admin = desktop.
export const type = {
  display:   { size: 30, weight: 700, line: 1.2 },
  h1:        { size: 24, weight: 700, line: 1.2 },
  h2:        { size: 20, weight: 600, line: 1.2 },
  bodyLg:    { size: 16, weight: 400, line: 1.5 },
  body:      { size: 14, weight: 400, line: 1.5 },
  small:     { size: 12, weight: 500, line: 1.4 },
  label:     { size: 11, weight: 600, line: 1.3, tracking: '0.05em' },
};

export const radius = {
  xs: 2, sm: 4, md: 8, lg: 12, xl: 16, pill: 999,
};

export const shadow = {
  card:  '0 1px 3px rgba(0,0,0,.08)',
  soft:  '0 1px 3px rgba(0,0,0,.05)',
  lift:  '0 8px 20px -6px rgba(103,31,35,.5)',   // burgundy CTA glow
  modal: '0 30px 80px -30px rgba(40,8,16,.4)',
  phone: '0 30px 70px -20px rgba(40,8,16,.35)',
};

export const space = [0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56]; // 4px scale
