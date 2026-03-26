import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Client } from '../modules/clients/entities/client.entity';
import { Pwd } from '../modules/auth/entities/pwd.entity';
import { Pet } from '../modules/pets/entities/pet.entity';
import { ClinicalEncounter } from '../modules/clinical-records/entities/clinical-encounter.entity';
import { VaccineRecord } from '../modules/clinical-records/entities/vaccine-record.entity';
import { AllergyRecord } from '../modules/clinical-records/entities/allergy-record.entity';
import { Species } from '../modules/species/entities/species.entity';
import { Breed } from '../modules/breeds/entities/breed.entity';
import { Contact } from '../modules/contacts/entities/contact.entity';

const isTsRuntime = __filename.endsWith('.ts');
const migrationsPath = isTsRuntime
  ? 'src/database/migrations/*.ts'
  : 'dist/database/migrations/*.js';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'vetnest',
  entities: [
    Client,
    Pwd,
    Pet,
    Species,
    Breed,
    Contact,
    ClinicalEncounter,
    VaccineRecord,
    AllergyRecord,
  ],
  migrations: [migrationsPath],
  synchronize: false,
});
