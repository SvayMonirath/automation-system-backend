import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkflowGeneratorService } from './workflow-generator.service';
import { AiGeneratorController } from './ai-generator.controller';
import { PromptBuilderService } from './services/prompt-builder.service';
import { SetupRequirementService } from './services/setup-requirement.service';
import { ValidationModule } from '../validation/validation.module';
import { RegistryModule } from '../registry/registry.module';

@Module({
  imports: [ValidationModule, RegistryModule],
  controllers: [AiGeneratorController],
  providers: [
    PrismaService,
    WorkflowGeneratorService,
    PromptBuilderService,
    SetupRequirementService,
  ],
  exports: [
    WorkflowGeneratorService,
    PromptBuilderService,
    SetupRequirementService,
  ],
})
export class AiGeneratorModule {}
