import { IsDateString, IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsDateString()
  birthdate: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['M', 'F', 'O'])
  sex: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  avatar: string;
}
