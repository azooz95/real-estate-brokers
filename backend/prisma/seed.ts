// Seeds the database with data shaped like the frontend's mock fixtures
// (design_handoff_jiwar_reservation/react-app/src/data/fixtures.js) so the
// real backend reproduces the same screens out of the box.
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const IMG = '/assets/img/';

async function main() {
  await prisma.reservation.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.project.deleteMany();
  await prisma.broker.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.settings.deleteMany();

  const [alYasmeen, jiwar, heritage, aloula] = await Promise.all([
    prisma.project.create({ data: { name: 'Al-Yasmeen Towers', location: 'North Riyadh', image: IMG + 'b96715f1d5.jpg' } }),
    prisma.project.create({ data: { name: 'Jiwar Residencies', location: 'Heritage Corridor', image: IMG + '3b684231a6.jpg' } }),
    prisma.project.create({ data: { name: 'Heritage Heights', location: 'Diplomatic Quarter', image: IMG + 'c89aedd981.jpg' } }),
    prisma.project.create({ data: { name: 'Aloula Towers', location: "King's Estate District", image: IMG + 'd0ede1ec14.png' } }),
  ]);

  const heritageSuiteDescription = [
    'Experience the pinnacle of Heritage Excellence. This Type A1 unit blends traditional architectural motifs with modern engineering. Featuring expansive glass walls that invite the golden Al-Ula light, the residence offers a unique connection to the historic landscape while providing ultimate privacy and climate control.',
    "High-end finishes including locally sourced stone countertops, charcoal black architectural accents, and state-of-the-art smart home integration. Perfect for those seeking a prestigious residence in the heart of the kingdom's heritage corridor.",
  ];
  const heritageAmenities = [
    { icon: '🅿', label: 'Private Parking' },
    { icon: '❄', label: 'Central HVAC' },
    { icon: '🌿', label: 'Heritage Terrace' },
    { icon: '🛡', label: '24/7 Security' },
  ];

  const units = await Promise.all([
    prisma.unit.create({
      data: {
        code: 'JWR-101', title: 'Luxury 3-Bedroom Suite', price: 1_200_000, priceNote: 'Incl. VAT',
        rooms: 3, baths: 2, area: 185, status: 'available', image: IMG + '127dabc11f.png',
        projectId: alYasmeen.id,
      },
    }),
    prisma.unit.create({
      data: {
        code: 'JWR-102', title: 'Standard 2-Bedroom', price: 980_000, priceNote: 'Incl. VAT',
        rooms: 2, baths: 2, area: 142, status: 'reserved', image: IMG + '29d8146683.png',
        projectId: alYasmeen.id,
      },
    }),
    prisma.unit.create({
      data: {
        code: 'JWR-105', title: 'Penthouse Collection', price: 2_450_000, priceNote: 'Premium',
        rooms: 4, baths: 4, area: 320, status: 'hold', image: IMG + 'd0ede1ec14.png',
        statusReason: 'Pending client confirmation', statusChangedAt: new Date(),
        projectId: alYasmeen.id,
      },
    }),
    prisma.unit.create({
      data: {
        code: 'JWR-402', title: 'The Heritage Suite – Type A1', price: 1_450_000, priceNote: 'Incl. VAT',
        rooms: 3, baths: 2, area: 145, status: 'available', image: IMG + '6d0086420f.png',
        floor: '04', location: 'Al-Ula District, Heritage Sector', deposit: 5000,
        description: heritageSuiteDescription, amenities: heritageAmenities,
        gallery: [IMG + '6d0086420f.png'], map: IMG + 'de7d19813f.png',
        projectId: jiwar.id,
      },
    }),
    prisma.unit.create({
      data: {
        code: 'UNT-8801', title: 'East Wing Residence', price: 1_450_000, priceNote: 'Incl. VAT',
        rooms: 3, baths: 2, area: 210, floor: '24', status: 'available', image: IMG + '7134cb9936.png',
        projectId: aloula.id,
      },
    }),
    prisma.unit.create({
      data: {
        code: 'UNT-4212', title: 'Phase I Residence', price: 980_000, priceNote: 'Incl. VAT',
        rooms: 2, baths: 2, area: 142, floor: '02', status: 'hold', image: IMG + '0ed3f941c3.png',
        statusReason: 'On administrative hold', statusChangedAt: new Date(),
        projectId: jiwar.id,
      },
    }),
    prisma.unit.create({
      data: {
        code: 'UNT-9905', title: 'Penthouse Collection', price: 8_200_000, priceNote: 'Premium',
        rooms: 5, baths: 6, area: 320, floor: '48', status: 'reserved', image: IMG + 'd0ede1ec14.png',
        projectId: aloula.id,
      },
    }),
    prisma.unit.create({
      data: {
        code: 'UNT-1022', title: 'Phase II Residence', price: 2_100_000, priceNote: 'Incl. VAT',
        rooms: 3, baths: 3, area: 245, floor: '10', status: 'available', image: IMG + '2c64e8cb36.png',
        projectId: heritage.id,
      },
    }),
    prisma.unit.create({
      data: {
        code: 'UNT-3301', title: 'Phase II Compact', price: 650_000, priceNote: 'Incl. VAT',
        rooms: 1, baths: 1, area: 118, floor: '08', status: 'reserved', image: IMG + '127dabc11f.png',
        projectId: jiwar.id,
      },
    }),
  ]);

  const [hassan, fatima, yousef, laila] = await Promise.all([
    prisma.broker.create({ data: { id: 'ID-98210', name: 'Hassan Mansoor', mobile: '+966 50 100 0001', clicks: 2410 } }),
    prisma.broker.create({ data: { id: 'ID-98211', name: 'Fatima Al-Sudairy', mobile: '+966 50 100 0002', clicks: 1890 } }),
    prisma.broker.create({ data: { id: 'ID-98212', name: 'Yousef Ibrahim', mobile: '+966 50 100 0003', clicks: 940 } }),
    prisma.broker.create({ data: { id: 'ID-98213', name: 'Laila Bashar', mobile: '+966 50 100 0004', clicks: 3100 } }),
  ]);

  const byCode = (code: string) => units.find((u) => u.code === code)!;

  await Promise.all([
    prisma.reservation.create({
      data: {
        id: 'RES-8801', unitId: byCode('JWR-102').id, brokerId: fatima.id,
        clientName: 'Ahmed Qassim', clientPhone: '+966 50 998 7766',
        deposit: 5000, paymentMethod: 'stc', status: 'confirmed',
      },
    }),
    prisma.reservation.create({
      data: {
        id: 'RES-8802', unitId: byCode('UNT-9905').id, brokerId: hassan.id,
        clientName: 'Fahad Al-Rashidi', clientPhone: '+966 50 123 4567',
        deposit: 5000, paymentMethod: 'mada', status: 'confirmed',
      },
    }),
    prisma.reservation.create({
      data: {
        id: 'RES-8803', unitId: byCode('UNT-3301').id, brokerId: yousef.id,
        clientName: 'Mariam Saleh', clientPhone: '+966 55 987 6543',
        deposit: 5000, paymentMethod: 'card', status: 'confirmed',
      },
    }),
  ]);

  await prisma.adminUser.create({
    data: {
      email: 'aziz.alhaj30@gmail.com',
      password: await bcrypt.hash('Admin@12345', 10),
      name: 'Admin Manager',
      role: 'admin',
    },
  });

  await prisma.settings.create({
    data: {
      id: 1, reservationDeposit: 5000, vatRate: 15, holdWindowMinutes: 10, currency: 'SAR',
      paymentGateway: true, smsAlerts: true, bilingualReceipts: false,
    },
  });

  console.log('Seed complete. Admin login: aziz.alhaj30@gmail.com / Admin@12345');
  console.log(`Broker tracking ref for client flow testing: ${laila.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
