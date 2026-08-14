import { ExecutionModule } from './modules/execution/execution.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { RegistryModule } from './modules/registry/registry.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { ValidationModule } from './modules/validation/validation.module';
import { QueueModule } from './modules/queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env', '.env'],
      load: [configuration],
    }),
    PrismaModule,
    RegistryModule,
    WorkflowModule,
    ValidationModule,
    QueueModule,
    ExecutionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
