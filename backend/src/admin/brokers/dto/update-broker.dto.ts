import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { BrokerStatus } from '@prisma/client';

export class UpdateBrokerDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  mobile?: string;

  @IsOptional()
  @IsEnum(BrokerStatus)
  status?: BrokerStatus;
}
