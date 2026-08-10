import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ValidationModule } from '../validation/validation.module';

@Module({
  imports: [PrismaModule, ValidationModule],
  controllers: [WorkflowController],
  providers: [WorkflowService],
  exports: [WorkflowService],
})
export class WorkflowModule {}
