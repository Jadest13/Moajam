import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './common/auth/auth.module.js';
import { DatabaseModule } from './common/database/database.module.js';
import { validateEnvironment } from './config/environment.js';
import { HealthController } from './health/health.controller.js';
import { WorkspacesController } from './workspaces/workspaces.controller.js';
import { MediaController } from './media/media.controller.js';
import { StorageService } from './media/storage.service.js';
import { SeparationService } from './media/separation.service.js';

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
  controllers: [HealthController, WorkspacesController, MediaController],
  providers: [StorageService, SeparationService],
})
export class AppModule {}
