import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Pet } from '../pets/entities/pet.entity';
import { ClinicalRecordsController } from './clinical-records.controller';
import { ClinicalRecordsService } from './clinical-records.service';
import { ClinicalEncounter } from './entities/clinical-encounter.entity';
import { AllergyRecord } from './entities/allergy-record.entity';
import { VaccineRecord } from './entities/vaccine-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClinicalEncounter, VaccineRecord, AllergyRecord, Pet]),
    AuthModule,
  ],
  controllers: [ClinicalRecordsController],
  providers: [ClinicalRecordsService],
})
export class ClinicalRecordsModule {}
