import { Controller, Get, Param } from '@nestjs/common';
import { UnitsService } from './units.service';

@Controller('units')
export class UnitsController {
  constructor(private units: UnitsService) {}

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.units.getDetail(id);
  }
}
