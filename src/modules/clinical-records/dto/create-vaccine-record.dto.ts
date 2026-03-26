import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVaccineRecordDto {
  @IsString()
  @IsNotEmpty()
  vaccineName: string;

  @IsDateString()
  applicationDate: string;

  @IsOptional()
  @IsDateString()
  nextDueDate?: string;

  @IsOptional()
  @IsString()
  lotNumber?: string;

  @IsOptional()
  @IsUUID()
  veterinarianUserId?: string;
}
