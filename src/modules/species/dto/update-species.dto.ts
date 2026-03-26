import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSpeciesDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name?: string;
}
