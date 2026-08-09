# Graph Report - .  (2026-08-09)

## Corpus Check
- 23 files · ~3,665 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 174 nodes · 181 edges · 32 communities (11 shown, 21 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Package Dependencies
- TypeScript Compiler Setup
- App Controller & Routes
- npm / pnpm Build Scripts
- Jest E2E Testing Config
- Prisma Service & Module
- Build TS Config
- Package Metadata
- Dev Dependencies
- NestJS CLI Settings
- Module 10
- Module 11
- Module 12
- Module 13
- Module 14
- Module 15
- Module 16
- Module 17
- Module 18
- Module 19
- Module 20
- Module 21
- Module 22
- Module 23
- Module 24
- Module 25
- Module 26
- Module 27
- Module 28
- Module 29
- Module 30

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 22 edges
2. `scripts` - 17 edges
3. `jest` - 8 edges
4. `AppService` - 7 edges
5. `AppController` - 6 edges
6. `PrismaService` - 5 edges
7. `exclude` - 5 edges
8. `moduleFileExtensions` - 4 edges
9. `AppModule` - 4 edges
10. `PrismaModule` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (32 total, 21 thin omitted)

### Community 0 - "Package Dependencies"
Cohesion: 0.09
Nodes (23): dependencies, class-transformer, class-validator, helmet, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/platform-express (+15 more)

### Community 1 - "TypeScript Compiler Setup"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 2 - "App Controller & Routes"
Cohesion: 0.18
Nodes (7): AppController, AppModule, Module, AppService, Injectable, Controller, Get

### Community 3 - "npm / pnpm Build Scripts"
Cohesion: 0.12
Nodes (17): scripts, build, db:down, db:up, format, lint, prisma:generate, prisma:migrate (+9 more)

### Community 4 - "Jest E2E Testing Config"
Cohesion: 0.15
Nodes (13): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+5 more)

### Community 5 - "Prisma Service & Module"
Cohesion: 0.25
Nodes (5): PrismaModule, Module, PrismaService, Injectable, Global

### Community 6 - "Build TS Config"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 7 - "Package Metadata"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 8 - "Dev Dependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @nestjs/testing, ts-jest, @types/express, @nestjs/testing, ts-jest, @types/express

### Community 9 - "NestJS CLI Settings"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

## Knowledge Gaps
- **97 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies` to `Package Metadata`, `Module 10`, `Module 11`, `Module 12`, `Module 13`, `Module 14`, `Module 15`, `Module 16`, `Module 17`, `Module 18`, `Module 19`, `Module 20`, `Module 21`, `Module 22`, `Module 23`, `Module 24`, `Module 25`, `Module 26`, `Module 27`, `Module 28`, `Module 29`, `Module 30`?**
  _High betweenness centrality (0.268) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies` to `Package Metadata`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `scripts` connect `npm / pnpm Build Scripts` to `Package Metadata`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Setup` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `npm / pnpm Build Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._