import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async list() {
    const projects = await this.prisma.project.findMany({
      include: { units: { select: { status: true } } },
      orderBy: { createdAt: 'asc' },
    });

    return projects.map((p) => ({
      id: p.id,
      name: p.name,
      location: p.location,
      image: p.image,
      status:
        p.units.length > 0 && p.units.every((u) => u.status !== 'available')
          ? 'reserved'
          : 'available',
    }));
  }

  async listUnits(projectId: string, type?: string) {
    const rooms = type && type !== 'all' ? Number(type) : undefined;
    const units = await this.prisma.unit.findMany({
      where: { projectId, ...(rooms ? { rooms } : {}) },
      orderBy: { createdAt: 'asc' },
    });

    return units.map((u) => ({
      id: u.id,
      code: u.code,
      title: u.title,
      price: u.price,
      priceNote: u.priceNote,
      rooms: u.rooms,
      baths: u.baths,
      area: u.area,
      status: u.status,
      image: u.image,
    }));
  }
}
