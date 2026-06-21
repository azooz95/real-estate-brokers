import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UnitStatus } from '@prisma/client';

export class SetUnitStatusDto {
  @IsEnum(UnitStatus)
  status: UnitStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}
