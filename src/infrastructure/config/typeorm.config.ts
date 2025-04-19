// src/infrastructure/config/typeorm.config.ts
import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || '2101990',
  database: process.env.DATABASE_NAME || 'hotel_management',
  synchronize: process.env.DB_SYNC === 'false',
  logging: process.env.DB_LOGGING === 'true',
  entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
}));