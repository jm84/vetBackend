import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AllergySeverity } from '../entities/allergy-record.entity';

export class CreateAllergyRecordDto {
  @IsString()
  @IsNotEmpty()
  allergen: string;

  @IsString()
  @IsNotEmpty()
  reaction: string;

  @IsEnum(AllergySeverity)
  severity: AllergySeverity;

  @IsOptional()
  @IsString()
  notes?: string;
}
