import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InventoryService } from './inventory.service';
import { SetUnitStatusDto } from './dto/set-unit-status.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class InventoryController {
  constructor(private inventory: InventoryService) {}

  @Get('inventory')
  list() {
    return this.inventory.list();
  }

  @Get('inventory/:code')
  getAdminDetail(@Param('code') code: string) {
    return this.inventory.getAdminDetail(code);
  }

  @Patch('units/:code/status')
  setStatus(@Param('code') code: string, @Body() dto: SetUnitStatusDto) {
    return this.inventory.setStatus(code, dto);
  }
}
