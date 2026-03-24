import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Client } from '../modules/clients/entities/client.entity';
import { Pwd } from '../modules/auth/entities/pwd.entity';

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
  entities: [Client, Pwd],
  migrations: [migrationsPath],
  synchronize: false,
});
