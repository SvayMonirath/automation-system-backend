import { Injectable, NotFoundException } from '@nestjs/common';
import { NODE_REGISTRY } from './constants/node-registry.constant';
import { CONNECTOR_REGISTRY } from './constants/connector-registry.constant';
import {
  NodeSpec,
  ConnectorSpec,
  NodeType,
} from './interfaces/registry.interface';

@Injectable()
export class RegistryService {
  /**
   * Retrieve all registered node specs (Core Utilities + Scenario AI nodes)
   */
  getAllNodes(): NodeSpec[] {
    return Object.values(NODE_REGISTRY);
  }

  /**
   * Filter nodes by category (e.g. TRIGGER, AI, DATA, LOGIC, ACTION)
   */
  getNodesByCategory(category: NodeType): NodeSpec[] {
    return Object.values(NODE_REGISTRY).filter(
      (node) => node.category === category,
    );
  }

  /**
   * Retrieve single node spec by type ID
   */
  getNodeSpec(type: string): NodeSpec {
    const spec = NODE_REGISTRY[type];
    if (!spec) {
      throw new NotFoundException(
        `Node type '${type}' is not registered in OPAL Registry.`,
      );
    }
    return spec;
  }

  /**
   * Retrieve all connector specs
   */
  getAllConnectors(): ConnectorSpec[] {
    return Object.values(CONNECTOR_REGISTRY);
  }

  /**
   * Retrieve single connector spec
   */
  getConnectorSpec(type: string): ConnectorSpec {
    const spec = CONNECTOR_REGISTRY[type];
    if (!spec) {
      throw new NotFoundException(
        `Connector type '${type}' is not registered in OPAL Registry.`,
      );
    }
    return spec;
  }
}
