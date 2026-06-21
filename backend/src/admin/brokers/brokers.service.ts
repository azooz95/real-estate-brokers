import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { UpdateBrokerDto } from './dto/update-broker.dto';

@Injectable()
export class BrokersService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  private trackingUrl(brokerId: string) {
    const base =
      this.config.get<string>('CLIENT_BASE_URL') ?? 'http://localhost:5173';
    return `${base}/?ref=${brokerId}`;
  }

  async list() {
    const brokers = await this.prisma.broker.findMany({
      include: {
        reservations: {
          where: { status: 'confirmed' },
          include: { unit: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return brokers.map((b) => ({
      id: b.id,
      name: b.name,
      mobile: b.mobile,
      status: b.status,
      trackingUrl: this.trackingUrl(b.id),
      clicks: b.clicks,
      unitsReserved: b.reservations.length,
      revenue: b.reservations.reduce((sum, r) => sum + r.unit.price, 0),
    }));
  }

  async create(dto: CreateBrokerDto) {
    let id: string;
    do {
      id = `ID-${Math.floor(10000 + Math.random() * 90000)}`;
    } while (await this.prisma.broker.findUnique({ where: { id } }));

    const broker = await this.prisma.broker.create({
      data: { id, name: dto.fullName, mobile: dto.mobile },
    });

    return {
      id: broker.id,
      name: broker.name,
      mobile: broker.mobile,
      status: broker.status,
      trackingUrl: this.trackingUrl(broker.id),
      clicks: 0,
      unitsReserved: 0,
      revenue: 0,
    };
  }

  // Edits the phone on file and/or suspends the broker. A suspended broker's
  // tracking link stops attributing — see BrokerLookupService.getPublicInfo
  // and ReservationsService.create, which both treat a suspended broker as
  // if it doesn't exist.
  async update(id: string, dto: UpdateBrokerDto) {
    const broker = await this.prisma.broker.findUnique({ where: { id } });
    if (!broker) throw new NotFoundException('Broker not found');

    const updated = await this.prisma.broker.update({
      where: { id },
      data: {
        mobile: dto.mobile ?? broker.mobile,
        status: dto.status ?? broker.status,
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      mobile: updated.mobile,
      status: updated.status,
    };
  }

  // Reservations already attributed to this broker are kept (audit ledger
  // integrity) — the FK is ON DELETE SET NULL, so they just lose attribution.
  async remove(id: string) {
    const broker = await this.prisma.broker.findUnique({ where: { id } });
    if (!broker) throw new NotFoundException('Broker not found');
    await this.prisma.broker.delete({ where: { id } });
  }
}
