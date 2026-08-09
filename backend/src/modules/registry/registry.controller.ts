import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RegistryService } from './registry.service';
import { NodeType } from './interfaces/registry.interface';

@ApiTags('Registry')
@Controller('registry')
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {}

  @Get('nodes')
  @ApiOperation({
    summary: 'List all registered nodes (optionally filtered by category)',
  })
  @ApiQuery({ name: 'category', enum: NodeType, required: false })
  getNodes(@Query('category') category?: NodeType) {
    if (category) {
      return this.registryService.getNodesByCategory(category);
    }
    return this.registryService.getAllNodes();
  }

  @Get('nodes/:type')
  @ApiOperation({ summary: 'Get specification for a specific node type' })
  getNode(@Param('type') type: string) {
    return this.registryService.getNodeSpec(type);
  }

  @Get('connectors')
  @ApiOperation({ summary: 'List all registered connectors and capabilities' })
  getConnectors() {
    return this.registryService.getAllConnectors();
  }

  @Get('connectors/:type')
  @ApiOperation({ summary: 'Get specification for a specific connector type' })
  getConnector(@Param('type') type: string) {
    return this.registryService.getConnectorSpec(type);
  }
}
