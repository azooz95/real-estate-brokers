import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async list() {
    const reservations = await this.prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' },
      include: { unit: { include: { project: true } }, broker: true },
    });

    return reservations.map((r) => ({
      ts: r.createdAt.toISOString().slice(0, 19).replace('T', ' '),
      ref: r.id,
      client: r.clientName,
      phone: r.clientPhone,
      project: r.unit.project.name,
      unit: r.unit.title,
      deposit: r.deposit,
      broker: r.broker?.name ?? '—',
    }));
  }
}
