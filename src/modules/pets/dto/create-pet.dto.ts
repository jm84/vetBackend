import {
  ArrayUnique,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { PetColor } from '../entities/pet.entity';

export class CreatePetDto {
  @IsUUID()
  clientId: string;

  @IsUUID()
  breedId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['M', 'F', 'O'])
  sex: string;

  @IsDateString()
  birthdate: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weightCurrent?: number;

  @IsOptional()
  @IsEnum(PetColor, { each: true })
  @ArrayUnique()
  color?: PetColor[];

  @IsOptional()
  @IsString()
  @MaxLength(60)
  microchip?: string;

  @IsOptional()
  @IsBoolean()
  sterilized?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
