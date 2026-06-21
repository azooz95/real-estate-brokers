import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

class ClientInfoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  unitId: string;

  @IsOptional()
  @IsString()
  brokerRef?: string;

  @ValidateNested()
  @Type(() => ClientInfoDto)
  client: ClientInfoDto;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
