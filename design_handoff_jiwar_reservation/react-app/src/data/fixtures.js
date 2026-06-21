// ============================================================================
// Mock fixtures — used by api/client.js while USE_MOCK = true.
// Mirrors the shape Claude Code's backend should return. Asset paths point at
// /assets/img/* (copied from the Figma export into public/).
// ============================================================================
const IMG = '/assets/img/';

export const session = { token: 'mock.jwt.token', user: { name: 'Admin Manager', role: 'admin' } };

export const projects = [
  { id: 'p1', name: 'Al-Yasmeen Towers', location: 'North Riyadh',       status: 'reserved',  image: IMG + 'b96715f1d5.jpg' },
  { id: 'p2', name: 'Jiwar Residencies', location: 'Heritage Corridor',  status: 'available', image: IMG + '3b684231a6.jpg' },
  { id: 'p3', name: 'Heritage Heights',  location: 'Diplomatic Quarter', status: 'available', image: IMG + 'c89aedd981.jpg' },
];

export const units = [
  { id: 'u1', code: 'JWR-101', title: 'Luxury 3-Bedroom Suite', price: 1200000, priceNote: 'Incl. VAT', rooms: 3, baths: 2, area: 185, status: 'available', image: IMG + '127dabc11f.png' },
  { id: 'u2', code: 'JWR-102', title: 'Standard 2-Bedroom',     price: 980000,  priceNote: 'Incl. VAT', rooms: 2, baths: 2, area: 142, status: 'reserved',  image: IMG + '29d8146683.png' },
  { id: 'u3', code: 'JWR-105', title: 'Penthouse Collection',   price: 2450000, priceNote: 'Premium',   rooms: 4, baths: 4, area: 320, status: 'hold',      image: IMG + 'd0ede1ec14.png' },
];

export const unitDetail = {
  id: 'u1', code: 'JWR-402', title: 'The Heritage Suite – Type A1', status: 'available',
  location: 'Al-Ula District, Heritage Sector', priceFrom: 1450000, deposit: 5000, floor: '04',
  specs: { bedrooms: 3, bathrooms: 2, area: 145 },
  description: [
    'Experience the pinnacle of Heritage Excellence. This Type A1 unit blends traditional architectural motifs with modern engineering. Featuring expansive glass walls that invite the golden Al-Ula light, the residence offers a unique connection to the historic landscape while providing ultimate privacy and climate control.',
    "High-end finishes including locally sourced stone countertops, charcoal black architectural accents, and state-of-the-art smart home integration. Perfect for those seeking a prestigious residence in the heart of the kingdom's heritage corridor.",
  ],
  amenities: [
    { icon: '🅿', label: 'Private Parking' }, { icon: '❄', label: 'Central HVAC' },
    { icon: '🌿', label: 'Heritage Terrace' }, { icon: '🛡', label: '24/7 Security' },
  ],
  gallery: [IMG + '6d0086420f.png'], map: IMG + 'de7d19813f.png',
};

export const paymentMethods = [
  { id: 'mada',   label: 'MADA',        icon: IMG + '953c23eb00.jpg' },
  { id: 'stc',    label: 'STC PAY',     icon: IMG + '9d789de405.jpg' },
  { id: 'apple',  label: 'APPLE PAY',   icon: IMG + '810ee4e987.jpg' },
  { id: 'card',   label: 'CREDIT CARD', icon: IMG + '90356f40c4.jpg' },
];

export const reservationResult = {
  id: 'RES-8821', status: 'confirmed', unitCode: 'AL-ULA-042',
  deposit: 25000, broker: 'Fahad Al-Mubarak', receiptUrl: '#',
};

export const brokers = [
  { id: 'ID-98210', name: 'Hassan Mansoor',    trackingUrl: 'jiw.ar/hassan_m', clicks: 2410, unitsReserved: 12, revenue: 450000 },
  { id: 'ID-98211', name: 'Fatima Al-Sudairy', trackingUrl: 'jiw.ar/fatima_s', clicks: 1890, unitsReserved: 8,  revenue: 310000 },
  { id: 'ID-98212', name: 'Yousef Ibrahim',    trackingUrl: 'jiw.ar/yousef_i', clicks: 940,  unitsReserved: 3,  revenue: 125000 },
  { id: 'ID-98213', name: 'Laila Bashar',      trackingUrl: 'jiw.ar/laila_b',  clicks: 3100, unitsReserved: 15, revenue: 590000 },
];

export const inventory = [
  { code: 'UNT-8801', project: 'Aloula Towers - East Wing', floor: '24', beds: 3, baths: 2, price: 1450000, status: 'available' },
  { code: 'UNT-4212', project: 'Jiwar Residences',         floor: '02', beds: 2, baths: 2, price: 980000,  status: 'hold' },
  { code: 'UNT-9905', project: 'Aloula Towers - Penthouse', floor: '48', beds: 5, baths: 6, price: 8200000, status: 'reserved' },
  { code: 'UNT-1022', project: 'Heritage Heights',         floor: '10', beds: 3, baths: 3, price: 2100000, status: 'available' },
  { code: 'UNT-3301', project: 'Jiwar Residences',         floor: '08', beds: 1, baths: 1, price: 650000,  status: 'reserved' },
];

export const dashboard = {
  kpis: [
    { label: 'TOTAL SALES VOLUME', value: 'SAR 142.5M', delta: '12%', sub: '+5 today' },
    { label: 'ACTIVE RESERVATIONS', value: '128' },
    { label: 'TOTAL LIVE MARKETERS', value: '45' },
    { label: 'INVENTORY OCCUPANCY', value: '78%' },
  ],
  activity: [
    { ini: 'AA', tone: 'gold',    text: 'Ahmed Al-Saud reserved Unit 402', meta: 'via Marketer Khalid • 2 minutes ago', amount: 'SAR 4.2M' },
    { ini: 'MB', tone: 'rose',    text: 'Mona Bin Jawi initiated inquiry for Villa Al-Nakheel', meta: 'via Marketer Sarah • 15 minutes ago', tag: 'INQUIRY' },
    { ini: 'KA', tone: 'mint',    text: 'Khalil Al-Otaibi cancelled reservation for Unit 108', meta: 'System automated update • 1 hour ago' },
    { ini: 'RA', tone: 'sand',    text: 'Rayan Abdullah completed payment for Penthouse 12', meta: 'via Marketer Omar • 3 hours ago', amount: 'SAR 8.9M' },
    { ini: 'SH', tone: 'neutral', text: 'Sultan Hussain joined as a Registered Marketer', meta: 'Admin Approved • 5 hours ago' },
  ],
  inventoryStatus: { total: 540, breakdown: [
    { label: 'Available', units: 324, pct: 60 },
    { label: 'Reserved',  units: 135, pct: 25 },
    { label: 'Hold',      units: 81,  pct: 15 },
  ] },
};

export const transactions = [
  { ts: '2023-10-24 14:22:11', ref: 'TRX-9981', client: 'Fahad Al-Harbi',   phone: '+966 50 123 4567', project: 'Al-Nargis Residence',   unit: 'Unit 4B-102',      deposit: 5000, broker: 'Sultan I.' },
  { ts: '2023-10-24 13:45:04', ref: 'TRX-9980', client: 'Mariam Saleh',     phone: '+966 55 987 6543', project: 'Jiwar Tower I',         unit: 'Unit P-12',        deposit: 5000, broker: 'Noura Salem' },
  { ts: '2023-10-24 11:10:55', ref: 'TRX-9979', client: 'Khalid Bin Walid', phone: '+966 54 332 1100', project: 'The Courtyard Villas',  unit: 'Villa 09-A',       deposit: 5000, broker: 'Sultan I.' },
  { ts: '2023-10-23 17:01:22', ref: 'TRX-9978', client: 'Ahmed Qassim',     phone: '+966 50 998 7766', project: 'Al-Nargis Residence',   unit: 'Unit 2A-305',      deposit: 5000, broker: 'Faisal Aziz' },
  { ts: '2023-10-23 15:33:10', ref: 'TRX-9977', client: 'Hassan Tariq',     phone: '+966 56 776 5544', project: 'Skyline Heights',       unit: 'Penthouse 402',    deposit: 5000, broker: 'Noura Salem' },
];

export const settings = {
  reservationDeposit: 5000, vatRate: 15, holdWindowMinutes: 10, currency: 'SAR',
  integrations: { paymentGateway: true, smsAlerts: true, bilingualReceipts: false },
};
