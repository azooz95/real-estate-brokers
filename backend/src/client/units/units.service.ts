import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  async getDetail(id: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
      include: { project: true },
    });
    if (!unit) throw new NotFoundException('Unit not found');

    const settings = await this.prisma.settings.findUnique({ where: { id: 1 } });

    return {
      id: unit.id,
      code: unit.code,
      title: unit.title,
      status: unit.status,
      location: unit.location ?? unit.project.location,
      priceFrom: unit.price,
      deposit: unit.deposit ?? settings?.reservationDeposit ?? 5000,
      floor: unit.floor,
      specs: { bedrooms: unit.rooms, bathrooms: unit.baths, area: unit.area },
      description: unit.description ?? [],
      amenities: unit.amenities ?? [],
      gallery: unit.gallery ?? [unit.image],
      map: unit.map,
    };
  }
}
