import {
  ArrayUnique,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { PetColor } from '../entities/pet.entity';

export class UpdatePetDto {
  @IsOptional()
  @IsUUID()
  breedId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @IsIn(['M', 'F', 'O'])
  sex?: string;

  @IsOptional()
  @IsDateString()
  birthdate?: string;

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
