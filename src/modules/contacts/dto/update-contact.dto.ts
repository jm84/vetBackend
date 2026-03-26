import { IsOptional, IsUUID } from 'class-validator';

export class UpdateContactDto {
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsUUID()
  petId?: string;
}
