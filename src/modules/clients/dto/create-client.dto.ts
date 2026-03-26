import { IsDateString, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 255)
  address: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 12)
  phone: string;

  @IsDateString()
  birthdate: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['M', 'F', 'O'])
  sex: string;

  @IsEmail()
  @Length(5, 150)
  email: string;

  @IsString()
  @Length(10, 255)
  @IsOptional()
  avatar?: string;
}
