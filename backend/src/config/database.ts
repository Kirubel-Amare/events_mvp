import { DataSource } from 'typeorm';
import path from 'path';
import { config } from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.database.url,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,

  // Auto-sync only in development for convenience
  synchronize: config.nodeEnv === 'development',

  // Logging options:
  // - 'all' logs everything
  // - ['query', 'error'] logs queries + errors
  // - ['error'] logs only errors
  // - false disables all SQL logging
  logging: config.nodeEnv === 'development' ? ['error'] : false,

  entities: [path.join(__dirname, '../models/**/*.{ts,js}')],
  migrations: [path.join(__dirname, '../database/migrations/**/*.{ts,js}')],
  subscribers: [],
});
