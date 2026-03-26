import { IsUUID } from 'class-validator';

export class CreateContactDto {
  @IsUUID()
  clientId: string;

  @IsUUID()
  petId: string;
}
