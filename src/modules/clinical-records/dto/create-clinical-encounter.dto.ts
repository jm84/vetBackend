import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateClinicalEncounterDto {
  @IsUUID()
  petId: string;

  @IsUUID()
  veterinarianUserId: string;

  @IsString()
  @IsNotEmpty()
  reasonForVisit: string;

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

  @IsDateString()
  encounterDate: string;

  @IsOptional()
  @IsDateString()
  followUpDate?: string;
}
