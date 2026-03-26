import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetsModule } from './modules/pets/pets.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ClinicalRecordsModule } from './modules/clinical-records/clinical-records.module';
import { SpeciesModule } from './modules/species/species.module';
import { BreedsModule } from './modules/breeds/breeds.module';
import { ContactsModule } from './modules/contacts/contacts.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'vetnest',
      autoLoadEntities: true,
      migrations: ['dist/database/migrations/*.js'],
      migrationsRun: (process.env.DB_MIGRATIONS_RUN ?? 'false') === 'true',
      synchronize: (process.env.DB_SYNCHRONIZE ?? 'false') === 'true',
    }),
    PetsModule,
    SpeciesModule,
    BreedsModule,
    AuthModule,
    ClientsModule,
    ClinicalRecordsModule,
    ContactsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
