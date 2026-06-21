import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get() {
    const s = await this.prisma.settings.findUniqueOrThrow({ where: { id: 1 } });
    return this.toDto(s);
  }

  async update(dto: UpdateSettingsDto) {
    const s = await this.prisma.settings.update({
      where: { id: 1 },
      data: {
        reservationDeposit: dto.reservationDeposit,
        vatRate: dto.vatRate,
        holdWindowMinutes: dto.holdWindowMinutes,
        currency: dto.currency,
        paymentGateway: dto.integrations.paymentGateway,
        smsAlerts: dto.integrations.smsAlerts,
        bilingualReceipts: dto.integrations.bilingualReceipts,
      },
    });
    return this.toDto(s);
  }

  private toDto(s: {
    reservationDeposit: number;
    vatRate: number;
    holdWindowMinutes: number;
    currency: string;
    paymentGateway: boolean;
    smsAlerts: boolean;
    bilingualReceipts: boolean;
  }) {
    return {
      reservationDeposit: s.reservationDeposit,
      vatRate: s.vatRate,
      holdWindowMinutes: s.holdWindowMinutes,
      currency: s.currency,
      integrations: {
        paymentGateway: s.paymentGateway,
        smsAlerts: s.smsAlerts,
        bilingualReceipts: s.bilingualReceipts,
      },
    };
  }
}
