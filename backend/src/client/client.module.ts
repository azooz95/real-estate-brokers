import { Module } from '@nestjs/common';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { UnitsController } from './units/units.controller';
import { UnitsService } from './units/units.service';
import { ReservationsController } from './reservations/reservations.controller';
import { ReservationsService } from './reservations/reservations.service';
import { BrokerLookupController } from './brokers/broker-lookup.controller';
import { BrokerLookupService } from './brokers/broker-lookup.service';

@Module({
  controllers: [ProjectsController, UnitsController, ReservationsController, BrokerLookupController],
  providers: [ProjectsService, UnitsService, ReservationsService, BrokerLookupService],
})
export class ClientModule {}
