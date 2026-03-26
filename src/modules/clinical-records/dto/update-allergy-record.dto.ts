import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AllergySeverity } from '../entities/allergy-record.entity';

export class UpdateAllergyRecordDto {
  @IsOptional()
  @IsString()
  allergen?: string;

  @IsOptional()
  @IsString()
  reaction?: string;

  @IsOptional()
  @IsEnum(AllergySeverity)
  severity?: AllergySeverity;

  @IsOptional()
  @IsString()
  notes?: string;
}
