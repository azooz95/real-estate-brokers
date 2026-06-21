import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BrokersService } from './brokers.service';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { UpdateBrokerDto } from './dto/update-broker.dto';

@UseGuards(JwtAuthGuard)
@Controller('brokers')
export class BrokersController {
  constructor(private brokers: BrokersService) {}

  @Get()
  list() {
    return this.brokers.list();
  }

  @Post()
  create(@Body() dto: CreateBrokerDto) {
    return this.brokers.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBrokerDto) {
    return this.brokers.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.brokers.remove(id);
  }
}
