import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Breed } from '../breeds/entities/breed.entity';
import { Client } from '../clients/entities/client.entity';
import { PetsController } from './pets.controller';
import { Pet } from './entities/pet.entity';
import { PetsService } from './pets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pet, Client, Breed]), AuthModule],
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}
