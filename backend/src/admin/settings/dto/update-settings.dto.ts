import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class IntegrationsDto {
  @IsBoolean()
  paymentGateway: boolean;

  @IsBoolean()
  smsAlerts: boolean;

  @IsBoolean()
  bilingualReceipts: boolean;
}

export class UpdateSettingsDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  reservationDeposit: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  vatRate: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  holdWindowMinutes: number;

  @IsString()
  currency: string;

  @ValidateNested()
  @Type(() => IntegrationsDto)
  integrations: IntegrationsDto;
}
