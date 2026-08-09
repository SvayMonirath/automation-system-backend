# Design Specification: Modular NestJS Backend Setup

**Date**: 2026-08-09  
**Status**: Approved  
**Package Manager**: `pnpm`  
**Database**: PostgreSQL via Prisma ORM  

---

## 1. Executive Summary

This document specifies the structure and initial configuration for setting up a production-ready NestJS backend application in the target repository directory using `pnpm`. The setup integrates environment configuration (`@nestjs/config`), database access with Prisma ORM and PostgreSQL, OpenAPI documentation via `@nestjs/swagger`, request validation (`class-validator`), security headers (`helmet`), CORS configuration, and local containerized database tooling via `docker-compose`.

---

## 2. Directory & Architecture Layout

```
backend/
├── src/
│   ├── config/
│   │   └── configuration.ts   # Configuration schema & factory
│   ├── prisma/
│   │   ├── prisma.module.ts   # Database module export
│   │   └── prisma.service.ts  # Database service implementation
│   ├── app.controller.ts      # Root controller
│   ├── app.module.ts          # Application root module
│   ├── app.service.ts         # Root service
│   └── main.ts                # Application Bootstrap logic
├── prisma/
│   └── schema.prisma          # PostgreSQL schema definition
├── .env.example               # Template for environment variables
├── docker-compose.yml         # Containerized PostgreSQL service for local development
├── nest-cli.json              # Nest CLI settings
├── package.json               # Dependency definitions and scripts
└── tsconfig.json              # TypeScript compiler configuration
```

---

## 3. Core Modules & Configuration Details

### 3.1 Bootstrap Configuration (`src/main.ts`)
- **Port**: Default `3000` (configurable via `PORT` environment variable).
- **Global Prefix**: `/api` (OpenAPI Swagger UI mounted at `/api/docs`).
- **Validation**: Global `ValidationPipe` enabled with `{ whitelist: true, transform: true, forbidNonWhitelisted: true }`.
- **Security**: `helmet()` middleware enabled for secure HTTP response headers.
- **CORS**: Configured with permissive defaults for local development.

### 3.2 Environment Configuration (`src/config/configuration.ts` & `src/app.module.ts`)
- Configured using `@nestjs/config`.
- `ConfigModule.forRoot({ isGlobal: true })` registered in `AppModule`.
- Exposes typed properties: `port`, `databaseUrl`, `nodeEnv`.

### 3.3 Database Integration (`src/prisma/`)
- **Prisma Client**: Initialized for `postgresql` database provider.
- `PrismaService` extends `PrismaClient` and implements `OnModuleInit` / `OnModuleDestroy` hooks to handle connect/disconnect cleanly.
- `PrismaModule` exports `PrismaService` as a `@Global()` or reusable module.

### 3.4 Containerized Database (`docker-compose.yml`)
- PostgreSQL 16 container service.
- Default database name: `automation_db`.
- Default user: `postgres`, default password: `postgres_password`.
- Port binding: `5432:5432`.
- Persistent data volume attached.

---

## 4. Environment Variables (`.env.example`)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres_password@localhost:5432/automation_db?schema=public
```

---

## 5. Scripts & Tooling (`package.json`)

- `pnpm run start:dev` - Run live-reload NestJS development server.
- `pnpm run build` - Compile TypeScript to output dist directory.
- `pnpm run prisma:generate` - Generate Prisma Client artifacts.
- `pnpm run prisma:migrate` - Apply pending Prisma database migrations.
- `pnpm run db:up` - Start PostgreSQL container via `docker-compose up -d`.
- `pnpm run db:down` - Stop PostgreSQL container via `docker-compose down`.

---

## 6. Self-Review Checklist

- [x] Placeholder scan: No `TODO` or unassigned variables.
- [x] Internal consistency: All modules (Prisma, Swagger, Config) correlate across `main.ts`, `app.module.ts`, and `docker-compose.yml`.
- [x] Scope check: Focused strictly on foundational architecture and tooling setup.
- [x] Ambiguity check: PostgreSQL provider, port numbers, package manager (`pnpm`), and paths explicitly defined.
