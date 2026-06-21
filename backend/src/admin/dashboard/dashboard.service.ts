import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { sarShort, timeAgo } from '../../common/time-ago.util';

const TONES = ['gold', 'rose', 'mint', 'sand', 'neutral'];

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async get() {
    const [confirmedReservations, brokerCount, unitCounts, todayCount, recent] = await Promise.all([
      this.prisma.reservation.findMany({ where: { status: 'confirmed' }, include: { unit: true } }),
      this.prisma.broker.count(),
      this.prisma.unit.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.reservation.count({
        where: { status: 'confirmed', createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
      this.prisma.reservation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { unit: true, broker: true },
      }),
    ]);

    const totalSales = confirmedReservations.reduce((sum, r) => sum + r.unit.price, 0);
    const totalUnits = unitCounts.reduce((sum, u) => sum + u._count._all, 0);
    const availableUnits = unitCounts.find((u) => u.status === 'available')?._count._all ?? 0;
    const occupancy = totalUnits > 0 ? Math.round(((totalUnits - availableUnits) / totalUnits) * 100) : 0;

    const breakdown = unitCounts
      .filter((u) => u.status !== 'cancelled')
      .map((u) => ({
        label: u.status.charAt(0).toUpperCase() + u.status.slice(1),
        units: u._count._all,
        pct: totalUnits > 0 ? Math.round((u._count._all / totalUnits) * 100) : 0,
      }));

    return {
      kpis: [
        { label: 'TOTAL SALES VOLUME', value: sarShort(totalSales), sub: `+${todayCount} today` },
        { label: 'ACTIVE RESERVATIONS', value: String(confirmedReservations.length) },
        { label: 'TOTAL LIVE MARKETERS', value: String(brokerCount) },
        { label: 'INVENTORY OCCUPANCY', value: `${occupancy}%` },
      ],
      activity: recent.map((r, i) => ({
        ini: r.clientName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
        tone: TONES[i % TONES.length],
        text: `${r.clientName} reserved Unit ${r.unit.code}`,
        meta: `${r.broker ? `via Marketer ${r.broker.name}` : 'Direct reservation'} • ${timeAgo(r.createdAt)}`,
        amount: sarShort(r.unit.price),
      })),
      inventoryStatus: { total: totalUnits, breakdown },
    };
  }
}
