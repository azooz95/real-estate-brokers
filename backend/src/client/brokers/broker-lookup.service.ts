import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BrokerLookupService {
  constructor(private prisma: PrismaService) {}

  // Public lookup used by the client app to show the attributed broker as the
  // client's "dedicated representative". Only exposes contact fields — no
  // clicks/revenue (those are admin-only, see admin/brokers). A suspended
  // broker is treated as not found — their tracking link stops working.
  async getPublicInfo(id: string) {
    const broker = await this.prisma.broker.findUnique({ where: { id } });
    if (!broker || broker.status === 'suspended')
      throw new NotFoundException('Broker not found');
    return { id: broker.id, name: broker.name, mobile: broker.mobile };
  }
}
