import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SetUnitStatusDto } from './dto/set-unit-status.dto';
import { timeAgo } from '../../common/time-ago.util';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async list() {
    const units = await this.prisma.unit.findMany({
      include: { project: true },
      orderBy: { createdAt: 'asc' },
    });

    return units.map((u) => ({
      code: u.code,
      project: u.project.name,
      floor: u.floor,
      beds: u.rooms,
      baths: u.baths,
      area: u.area,
      price: u.price,
      status: u.status,
    }));
  }

  // Rich detail for the admin Unit Detail & Override modal: real holder (from
  // the latest reservation, if any) and a real activity timeline instead of
  // hand-authored placeholder copy.
  async getAdminDetail(code: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { code },
      include: {
        project: true,
        reservations: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    if (!unit) throw new NotFoundException('Unit not found');

    const reservation = unit.reservations[0] ?? null;
    const holder = reservation
      ? {
          name: reservation.clientName,
          phone: reservation.clientPhone,
          since: `${unit.status === 'hold' ? 'Held' : 'Reserved'} ${timeAgo(reservation.createdAt)}`,
        }
      : unit.status === 'hold'
        ? {
            name: 'On administrative hold',
            phone: 'Internal — no client yet',
            since: unit.statusChangedAt
              ? `Held ${timeAgo(unit.statusChangedAt)}`
              : 'Held',
          }
        : null;

    const timeline = [
      {
        icon: '📤',
        title: 'Unit Published',
        meta: `Synced • ${unit.createdAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`,
      },
    ];
    if (reservation) {
      timeline.unshift({
        icon: '💳',
        title: 'Deposit Received',
        meta: `Verified • ${timeAgo(reservation.createdAt)}`,
      });
    }
    if (unit.statusChangedAt) {
      timeline.unshift({
        icon: '🛡',
        title: `Status changed to ${unit.status}`,
        meta: `${unit.statusReason ?? 'Admin override'} • ${timeAgo(unit.statusChangedAt)}`,
      });
    }

    return {
      code: unit.code,
      status: unit.status,
      phase: unit.project.name,
      internalId: unit.id,
      area: `${unit.area} m²`,
      level: unit.floor ?? '—',
      beds: unit.rooms,
      baths: unit.baths,
      image: unit.image,
      gallery: (unit.gallery as string[] | null) ?? [unit.image],
      map: unit.map,
      holder,
      timeline,
    };
  }

  async setStatus(code: string, dto: SetUnitStatusDto) {
    const unit = await this.prisma.unit.findUnique({ where: { code } });
    if (!unit) throw new NotFoundException('Unit not found');

    const updated = await this.prisma.unit.update({
      where: { code },
      data: {
        status: dto.status,
        statusReason: dto.reason,
        statusChangedAt: new Date(),
      },
    });

    return { code: updated.code, status: updated.status };
  }
}
