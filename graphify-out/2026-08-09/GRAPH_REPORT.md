# Graph Report - Automation_System  (2026-08-09)

## Corpus Check
- 18 files · ~3,542 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 167 nodes · 161 edges · 34 communities (9 shown, 25 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3bc68012`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Package Dependencies
- TypeScript Compiler Setup
- Module
- npm / pnpm Build Scripts
- package.json
- app.module.ts
- Build TS Config
- ts-jest
- devDependencies
- NestJS CLI Settings
- Module 10
- Module 11
- Injectable
- @eslint/js
- eslint-plugin-prettier
- globals
- jest
- @nestjs/cli
- @nestjs/schematics
- prettier
- prisma
- source-map-support
- supertest
- Module 23
- Module 24
- Module 25
- Module 26
- Module 27
- Module 28
- Module 29
- Module 30
- Controller
- Get

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 22 edges
2. `scripts` - 17 edges
3. `jest` - 8 edges
4. `PrismaService` - 5 edges
5. `exclude` - 5 edges
6. `AppModule` - 4 edges
7. `moduleFileExtensions` - 4 edges
8. `PrismaModule` - 4 edges
9. `compilerOptions` - 2 edges
10. `@nestjs/common` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (34 total, 25 thin omitted)

### Community 0 - "Package Dependencies"
Cohesion: 0.09
Nodes (23): dependencies, class-transformer, class-validator, helmet, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/platform-express (+15 more)

### Community 1 - "TypeScript Compiler Setup"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 3 - "npm / pnpm Build Scripts"
Cohesion: 0.12
Nodes (17): scripts, build, db:down, db:up, format, lint, prisma:generate, prisma:migrate (+9 more)

### Community 4 - "package.json"
Cohesion: 0.10
Nodes (19): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+11 more)

### Community 5 - "app.module.ts"
Cohesion: 0.16
Nodes (7): AppModule, PrismaModule, Module, PrismaService, Injectable, Global, Module

### Community 6 - "Build TS Config"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 8 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @eslint/eslintrc, @nestjs/testing, @types/express, @eslint/eslintrc, @nestjs/testing, @types/express

### Community 9 - "NestJS CLI Settings"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

## Knowledge Gaps
- **97 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`, `ts-jest`, `Module 10`, `Module 11`, `@eslint/js`, `eslint-plugin-prettier`, `globals`, `jest`, `@nestjs/cli`, `@nestjs/schematics`, `prettier`, `prisma`, `source-map-support`, `supertest`, `Module 23`, `Module 24`, `Module 25`, `Module 26`, `Module 27`, `Module 28`, `Module 29`, `Module 30`?**
  _High betweenness centrality (0.291) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies` to `package.json`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **Why does `scripts` connect `npm / pnpm Build Scripts` to `package.json`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Setup` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `npm / pnpm Build Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._