import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateClinicalEncounterDto {
  @IsOptional()
  @IsUUID()
  veterinarianUserId?: string;

  @IsOptional()
  @IsString()
  reasonForVisit?: string;

  @IsOptional()
  @IsString()
  anamnesis?: string;

  @IsOptional()
  @IsString()
  physicalExam?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  treatmentPlan?: string;

  @IsOptional()
  @IsString()
  prescriptions?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  encounterDate?: string;

  @IsOptional()
  @IsDateString()
  followUpDate?: string;
}
