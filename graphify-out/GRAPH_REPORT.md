# Graph Report - Automation_System  (2026-08-10)

## Corpus Check
- 27 files · ~5,818 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 270 nodes · 323 edges · 39 communities (16 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c966570d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- TypeScript Compiler Setup
- Design Specification: Modular NestJS Backend Setup
- npm / pnpm Build Scripts
- package.json
- app.module.ts
- Build TS Config
- backend/README.md
- devDependencies
- NestJS CLI Settings
- Global Constraints
- 20260809151942_init_automation_core_tables/migration.sql
- README.md
- registry.service.ts
- CreateWorkflowDto
- eslint-config-prettier
- @eslint/eslintrc
- Workspace Rule: Inline Chat Code Changes Display
- @eslint/js
- eslint-plugin-prettier
- globals
- @nestjs/cli
- @nestjs/schematics
- @nestjs/testing
- prettier
- prisma
- source-map-support
- supertest
- ts-jest
- ts-node
- tsconfig-paths
- @types/express
- @types/jest
- @types/node
- @types/supertest
- @types/swagger-ui-express
- typescript
- typescript-eslint

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 22 edges
2. `scripts` - 17 edges
3. `RegistryService` - 10 edges
4. `RegistryController` - 9 edges
5. `CreateWorkflowDto` - 9 edges
6. `UpdateWorkflowDraftDto` - 9 edges
7. `WorkflowService` - 9 edges
8. `jest` - 8 edges
9. `PrismaService` - 7 edges
10. `Global Constraints` - 7 edges

## Surprising Connections (you probably didn't know these)
- `"credentials"` --references--> `"users"`  [EXTRACTED]
  backend/prisma/migrations/20260809151942_init_automation_core_tables/migration.sql → backend/prisma/migrations/20260809135427_initial/migration.sql
- `"workflows"` --references--> `"users"`  [EXTRACTED]
  backend/prisma/migrations/20260809151942_init_automation_core_tables/migration.sql → backend/prisma/migrations/20260809135427_initial/migration.sql

## Import Cycles
- None detected.

## Communities (39 total, 23 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, class-transformer, class-validator, helmet, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/platform-express (+17 more)

### Community 1 - "TypeScript Compiler Setup"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 2 - "Design Specification: Modular NestJS Backend Setup"
Cohesion: 0.17
Nodes (11): 1. Executive Summary, 2. Directory & Architecture Layout, 3.1 Bootstrap Configuration (`src/main.ts`), 3.2 Environment Configuration (`src/config/configuration.ts` & `src/app.module.ts`), 3.3 Database Integration (`src/prisma/`), 3.4 Containerized Database (`docker-compose.yml`), 3. Core Modules & Configuration Details, 4. Environment Variables (`.env.example`) (+3 more)

### Community 3 - "npm / pnpm Build Scripts"
Cohesion: 0.12
Nodes (17): scripts, build, db:down, db:up, format, lint, prisma:generate, prisma:migrate (+9 more)

### Community 4 - "package.json"
Cohesion: 0.10
Nodes (19): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+11 more)

### Community 5 - "app.module.ts"
Cohesion: 0.13
Nodes (9): AppModule, Module, RegistryModule, Module, PrismaModule, Module, PrismaService, Injectable (+1 more)

### Community 6 - "Build TS Config"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 7 - "backend/README.md"
Cohesion: 0.20
Nodes (9): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+1 more)

### Community 8 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, eslint, jest, ts-loader, eslint, jest, ts-loader

### Community 9 - "NestJS CLI Settings"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 10 - "Global Constraints"
Cohesion: 0.22
Nodes (8): Global Constraints, NestJS Modular Backend Setup Implementation Plan, Task 1: Initialize NestJS Application with pnpm, Task 2: Environment Configuration Setup, Task 3: Prisma ORM & Database Module Integration, Task 4: Swagger, Security, and Main Application Bootstrap, Task 5: Local Environment Setup & Docker Compose, Task 6: End-to-End Build Verification

### Community 11 - "20260809151942_init_automation_core_tables/migration.sql"
Cohesion: 0.39
Nodes (7): "users", "credentials", "execution_logs", "executions", "node_executions", "workflow_versions", "workflows"

### Community 13 - "registry.service.ts"
Cohesion: 0.14
Nodes (16): ApiOperation, ApiQuery, ApiTags, CONNECTOR_REGISTRY, NODE_REGISTRY, ConnectorSpec, NodeParamSchema, NodeSpec (+8 more)

### Community 14 - "CreateWorkflowDto"
Cohesion: 0.18
Nodes (12): ApiProperty, ApiPropertyOptional, CreateWorkflowDto, UpdateWorkflowDraftDto, UpdateWorkflowStatusDto, Injectable, WorkflowService, IsEnum (+4 more)

### Community 17 - "Workspace Rule: Inline Chat Code Changes Display"
Cohesion: 0.33
Nodes (5): 📄 [`backend/src/main.ts`](file:///Users/sorpheatepy/Library/CloudStorage/OneDrive-CambodiaAcademyofDigitalTechnology/NextGen%20Engagment/Automation_System/backend/src/main.ts#L13-L20), 🛠️ Code Changes Made In This Turn, Example Format:, MANDATORY: In-Chat Code Diffs For Every Edit, Workspace Rule: Inline Chat Code Changes Display

## Knowledge Gaps
- **127 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+122 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`, `eslint-config-prettier`, `@eslint/eslintrc`, `@eslint/js`, `eslint-plugin-prettier`, `globals`, `@nestjs/cli`, `@nestjs/schematics`, `@nestjs/testing`, `prettier`, `prisma`, `source-map-support`, `supertest`, `ts-jest`, `ts-node`, `tsconfig-paths`, `@types/express`, `@types/jest`, `@types/node`, `@types/supertest`, `@types/swagger-ui-express`, `typescript`, `typescript-eslint`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `scripts` connect `npm / pnpm Build Scripts` to `package.json`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _127 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Setup` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `npm / pnpm Build Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._