import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Role } from '../enums/role.enum';

export class RegisterAuthDto {
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

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3650)
  timeToExpire?: number;

  @IsOptional()
  @IsBoolean()
  isSecurity?: boolean;

  @IsString()
  @MinLength(8)
  password: string;
}
