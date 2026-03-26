import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SpeciesController } from './species.controller';
import { SpeciesService } from './species.service';
import { Species } from './entities/species.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Species]), AuthModule],
  controllers: [SpeciesController],
  providers: [SpeciesService],
  exports: [TypeOrmModule],
})
export class SpeciesModule {}
