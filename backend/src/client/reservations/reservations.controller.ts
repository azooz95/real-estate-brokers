import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Res,
  StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private reservations: ReservationsService) {}

  @Post()
  create(@Body() dto: CreateReservationDto) {
    return this.reservations.create(dto);
  }

  @Get(':id')
  getResult(@Param('id') id: string) {
    return this.reservations.getResult(id);
  }

  @Get(':id/receipt')
  @Header('Content-Type', 'text/html')
  getReceipt(@Param('id') id: string) {
    return this.reservations.getReceiptHtml(id);
    
  }

  @Get(':id/receipt/pdf')
  async getReceiptPdf(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const pdf = await this.reservations.getReceiptPdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="jiwar-receipt-${id}.pdf"`,
      'Content-Length': pdf.length,
    });
    return new StreamableFile(pdf);
  }
}
