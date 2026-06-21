import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BrokersController } from './brokers/brokers.controller';
import { BrokersService } from './brokers/brokers.service';
import { InventoryController } from './inventory/inventory.controller';
import { InventoryService } from './inventory/inventory.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { TransactionsController } from './transactions/transactions.controller';
import { TransactionsService } from './transactions/transactions.service';
import { SettingsController } from './settings/settings.controller';
import { SettingsService } from './settings/settings.service';

@Module({
  imports: [AuthModule],
  controllers: [
    BrokersController,
    InventoryController,
    DashboardController,
    TransactionsController,
    SettingsController,
  ],
  providers: [
    BrokersService,
    InventoryService,
    DashboardService,
    TransactionsService,
    SettingsService,
  ],
})
export class AdminModule {}
