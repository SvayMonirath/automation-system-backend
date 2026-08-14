// src/modules/execution/execution.module.ts
import { Module } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ExecutionController } from './execution.controller';
import { QueueModule } from '../queue/queue.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [QueueModule],
  controllers: [ExecutionController],
  providers: [ExecutionService, PrismaService],
  exports: [ExecutionService],
})
export class ExecutionModule {}
