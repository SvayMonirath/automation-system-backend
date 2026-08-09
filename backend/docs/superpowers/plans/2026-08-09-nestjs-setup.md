# NestJS Modular Backend Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffolding a production-ready NestJS backend application using `pnpm`, complete with `@nestjs/config`, Prisma ORM (PostgreSQL), Swagger documentation, request validation pipelines, security middleware, and local Docker Compose database service.

**Architecture:** Initialize standard NestJS layout using `pnpm`, add configuration module mapping, configure Prisma database connection service with lifecycle management hooks, configure Swagger UI and validation pipes in `main.ts`, and provide Docker compose tooling.

**Tech Stack:** NestJS v10+, TypeScript, pnpm, Prisma ORM, PostgreSQL, `@nestjs/config`, `@nestjs/swagger`, `class-validator`, `class-transformer`, `helmet`.

## Global Constraints

- Package manager MUST be `pnpm`.
- Database provider MUST be PostgreSQL.
- API documentation endpoint MUST be `/api/docs`.
- Global validation pipe MUST enforce `{ whitelist: true, transform: true, forbidNonWhitelisted: true }`.

---

### Task 1: Initialize NestJS Application with pnpm

**Files:**
- Create: `package.json`, `tsconfig.json`, `nest-cli.json`, `src/app.module.ts`, `src/app.controller.ts`, `src/app.service.ts`, `src/main.ts`

**Interfaces:**
- Consumes: Node.js & pnpm runtime environment.
- Produces: Base executable NestJS framework structure.

- [ ] **Step 1: Scaffold standard NestJS application using CLI via npx & pnpm**

Run:
```bash
npx -y @nestjs/cli new . --package-manager pnpm --skip-git
```

- [ ] **Step 2: Install core dependencies for Config, Validation, Security, and Swagger**

Run:
```bash
pnpm add @nestjs/config @nestjs/swagger class-validator class-transformer helmet
```

- [ ] **Step 3: Verify installation and build**

Run:
```bash
pnpm run build
```
Expected: Clean compilation into `dist/` directory without TypeScript errors.

- [ ] **Step 4: Commit initial scaffolding**

Run:
```bash
git init && git add . && git commit -m "feat: initialize NestJS baseline application with pnpm"
```

---

### Task 2: Environment Configuration Setup

**Files:**
- Create: `src/config/configuration.ts`
- Modify: `src/app.module.ts`

**Interfaces:**
- Consumes: Environment variables from process memory or `.env`.
- Produces: `ConfigModule` available globally to all application modules.

- [ ] **Step 1: Create typed configuration factory (`src/config/configuration.ts`)**

Write `src/config/configuration.ts`:
```typescript
export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
});
```

- [ ] **Step 2: Register ConfigModule in AppModule (`src/app.module.ts`)**

Modify `src/app.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- [ ] **Step 3: Run build to verify config integration**

Run:
```bash
pnpm run build
```
Expected: Compilation succeeds.

- [ ] **Step 4: Commit configuration module**

Run:
```bash
git add src/config/configuration.ts src/app.module.ts
git commit -m "feat: add global ConfigModule setup"
```

---

### Task 3: Prisma ORM & Database Module Integration

**Files:**
- Create: `prisma/schema.prisma`, `src/prisma/prisma.service.ts`, `src/prisma/prisma.module.ts`
- Modify: `src/app.module.ts`, `package.json`

**Interfaces:**
- Consumes: Database connection string from `ConfigService` / `DATABASE_URL`.
- Produces: `PrismaService` and `PrismaModule` exported globally for database access.

- [ ] **Step 1: Install Prisma dependencies**

Run:
```bash
pnpm add @prisma/client
pnpm add -D prisma
```

- [ ] **Step 2: Initialize Prisma schema (`prisma/schema.prisma`)**

Create `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

- [ ] **Step 3: Create PrismaService (`src/prisma/prisma.service.ts`)**

Create `src/prisma/prisma.service.ts`:
```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

- [ ] **Step 4: Create PrismaModule (`src/prisma/prisma.module.ts`)**

Create `src/prisma/prisma.module.ts`:
```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

- [ ] **Step 5: Register PrismaModule in AppModule and add helper scripts**

Modify `src/app.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Add scripts in `package.json`:
```json
"prisma:generate": "prisma generate",
"prisma:migrate": "prisma migrate dev"
```

- [ ] **Step 6: Generate Prisma Client & test compilation**

Run:
```bash
pnpm run prisma:generate && pnpm run build
```
Expected: `PrismaClient` generated successfully, TypeScript build succeeds.

- [ ] **Step 7: Commit Prisma ORM module**

Run:
```bash
git add prisma/schema.prisma src/prisma/ package.json src/app.module.ts
git commit -m "feat: add Prisma ORM module with PostgreSQL schema"
```

---

### Task 4: Swagger, Security, and Main Application Bootstrap

**Files:**
- Modify: `src/main.ts`

**Interfaces:**
- Consumes: `AppModule`, `ConfigService`, Swagger setup.
- Produces: HTTP Server listening on configured port with OpenAPI UI served at `/api/docs`.

- [ ] **Step 1: Configure main.ts with Helmet, ValidationPipe, and Swagger**

Update `src/main.ts`:
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  // Security Middleware
  app.use(helmet());
  app.enableCors();

  // Global Prefix & Validation Pipe
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Documentation Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Automation System API')
    .setDescription('Backend REST API specification for NextGen Engagement Automation System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('port') || 3000;
  await app.listen(port);
  logger.log(`Application successfully running on port ${port}`);
  logger.log(`Swagger documentation available at http://localhost:${port}/api/docs`);
}
bootstrap();
```

- [ ] **Step 2: Test TypeScript compilation**

Run:
```bash
pnpm run build
```
Expected: Clean build without compilation errors.

- [ ] **Step 3: Commit application bootstrap logic**

Run:
```bash
git add src/main.ts
git commit -m "feat: configure Swagger, global validation pipes, helmet, and CORS in bootstrap"
```

---

### Task 5: Local Environment Setup & Docker Compose

**Files:**
- Create: `.env.example`, `.env`, `docker-compose.yml`, `.gitignore`
- Modify: `package.json`

**Interfaces:**
- Consumes: Local Docker engine.
- Produces: PostgreSQL database container listening on port 5432.

- [ ] **Step 1: Create `.env.example` and `.env`**

Create `.env.example`:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres_password@localhost:5432/automation_db?schema=public
```

Copy `.env.example` to `.env`.

- [ ] **Step 2: Create `docker-compose.yml`**

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: automation_postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres_password
      POSTGRES_DB: automation_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

- [ ] **Step 3: Add database helper scripts to `package.json`**

In `package.json`, add:
```json
"db:up": "docker compose up -d",
"db:down": "docker compose down"
```

- [ ] **Step 4: Update `.gitignore` to ensure `.env` and `node_modules` are excluded**

Ensure `.gitignore` contains:
```
node_modules
dist
.env
```

- [ ] **Step 5: Commit Docker compose & env config**

Run:
```bash
git add .env.example docker-compose.yml package.json .gitignore
git commit -m "feat: add Docker Compose setup and environment template"
```

---

### Task 6: End-to-End Build Verification

**Files:**
- Read/Verify: All files in repository.

**Interfaces:**
- Consumes: Full codebase.
- Produces: Verified executable build artifact.

- [ ] **Step 1: Execute production build**

Run:
```bash
pnpm run build
```
Expected: Exit code 0, `dist/` contains output.

- [ ] **Step 2: Verify git status is clean**

Run:
```bash
git status
```
Expected: Clean working tree.
