import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBrokerDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  mobile: string;
}
