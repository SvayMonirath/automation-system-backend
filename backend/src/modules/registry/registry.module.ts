import { Module } from '@nestjs/common';
import { RegistryService } from './registry.service';
import { RegistryController } from './registry.controller';

@Module({
  controllers: [RegistryController],
  providers: [RegistryService],
  exports: [RegistryService], // Exported for ValidationModule & AI Generator
})
export class RegistryModule {}
