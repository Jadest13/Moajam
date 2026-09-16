import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './common/auth/auth.module.js';
import { DatabaseModule } from './common/database/database.module.js';
import { validateEnvironment } from './config/environment.js';
import { HealthController } from './health/health.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validate: validateEnvironment,
    }),
    AuthModule,
    DatabaseModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
