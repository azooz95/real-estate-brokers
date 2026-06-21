import { Controller, Get, Param } from '@nestjs/common';
import { BrokerLookupService } from './broker-lookup.service';

@Controller('brokers')
export class BrokerLookupController {
  constructor(private brokers: BrokerLookupService) {}

  @Get(':id')
  getPublicInfo(@Param('id') id: string) {
    return this.brokers.getPublicInfo(id);
  }
}
