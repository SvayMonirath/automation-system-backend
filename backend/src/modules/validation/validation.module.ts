import { Module } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { ValidationController } from './validation.controller';
import { RegistryModule } from '../registry/registry.module';
import { PrismaModule } from '../../prisma/prisma.module'; // Import your PrismaModule or DatabaseModule

@Module({
  imports: [RegistryModule, PrismaModule],
  controllers: [ValidationController],
  providers: [ValidationService],
  exports: [ValidationService], // Exported to be injected into WorkflowModule during publishing!
})
export class ValidationModule {}
