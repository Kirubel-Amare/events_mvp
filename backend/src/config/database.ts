import { DataSource } from 'typeorm';
import path from 'path';
import { config } from './env';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Event } from '../models/Event';
import { OrganizerProfile } from '../models/OrganizerProfile';
import { PersonalProfile } from '../models/PersonalProfile';
import { Application } from '../models/Application';
import { Plan } from '../models/Plan';
import { Notification } from '../models/Notification';
import { OrganizerApplication } from '../models/OrganizerApplication';
import { OrganizerFollower } from '../models/OrganizerFollower';
import { QuotaRequest } from '../models/QuotaRequest';
import { Report } from '../models/Report';
import { Review } from '../models/Review';

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
  logging: ['error'], // Always log errors, even in prod

  entities: [
    User,
    Category,
    Event,
    OrganizerProfile,
    PersonalProfile,
    Application,
    Plan,
    Notification,
    OrganizerApplication,
    OrganizerFollower,
    QuotaRequest,
    Report,
    Review
  ],
  migrations: [path.join(__dirname, '../database/migrations/**/*.{ts,js}')],
  subscribers: [],
});
