import { DataSource } from 'typeorm';
import path from 'path';
import { config } from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: config.nodeEnv !== 'production',
  logging: config.nodeEnv === 'development',
  entities: [path.join(__dirname, '../models/**/*.{ts,js}')],
  migrations: [path.join(__dirname, '../database/migrations/**/*.{ts,js}')],
  subscribers: [],
});