import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateBreedDto {
  @IsUUID()
  specieId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
