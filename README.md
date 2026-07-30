# Callvu Agenda API — Backend REST Service

> Servicio Backend autónomo para el motor de gestión de turnos e integración con agendas inteligentes.

---

## 1. Visión y Arquitectura

El **Callvu Agenda API** es el servicio central de lógica de negocio encuadrado en una **arquitectura modular de 3 capas** (Controller / Service / Repository):

- **Controller**: Maneja peticiones HTTP y valida la entrada de datos en tiempo de ejecución con **Zod**.
- **Service**: Concentra la lógica del dominio (reglas de atención, validaciones de slots, reservas). Desarrollado obligatoriamente mediante **Test-Driven Development (TDD)**.
- **Repository**: Capa de abstracción de datos (`IAgendaRepository`, etc.) desacoplada de la infraestructura, implementada con **Prisma ORM** y **PostgreSQL**.

```mermaid
graph TD
    Client["Cliente (Frontend / API Consumer)"] -->|HTTP REST| Controller["Controller Layer (Express + Zod Middleware)"]
    Controller -->|DTO Validado| Service["Service Layer (Domain Logic)"]
    Service -->|Repository Interface| Repository["Repository Layer (Prisma ORM)"]
    Repository -->|SQL| Database[(PostgreSQL Database)]
```

---

## 2. Tech Stack

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| Runtime | Node.js (v20+ LTS) | Entorno de ejecución de JS/TS |
| Lenguaje | TypeScript (v5.4+) | Tipado estático estricto |
| Web Framework | Express (v4) | Servidor HTTP REST |
| Validación | Zod | Esquemas de validación de DTOs en runtime |
| ORM | Prisma ORM (v5.14+) | Modelado y persistencia en PostgreSQL |
| Base de Datos | PostgreSQL | Base de datos relacional |
| Testing | Vitest + Supertest | Suite de pruebas unitarias e integración con TDD |

---

## 3. Estructura del Proyecto

```text
callvu-agenda-api/
├── prisma/
│   └── schema.prisma                # Esquema declarativo de base de datos
├── src/
│   ├── modules/
│   │   ├── agenda/                  # Módulo de Agendas y Horarios de Atención
│   │   │   ├── dto/                 # Esquemas Zod (createAgendaSchema, etc.)
│   │   │   ├── agenda.controller.ts # Handlers y rutas Express (/agendas)
│   │   │   ├── agenda.service.ts    # Lógica de negocio (TDD)
│   │   │   ├── agenda.repository.ts # Interfaz IAgendaRepository
│   │   │   └── prisma-agenda.repository.ts # Implementación Prisma
│   │   ├── cliente/                 # Módulo de Clientes (próximo)
│   │   └── turno/                   # Módulo de Turnos y Slots (próximo)
│   ├── shared/
│   │   └── middlewares/             # Middlewares globales (zod validation, etc.)
│   ├── types/                       # Interfaces y tipos de dominio
│   ├── app.ts                       # Configuración e Inyección de Dependencias Express
│   └── server.ts                    # Punto de entrada HTTP
├── openspec/                        # Especificaciones y requerimientos de cambio (SDD)
├── ARCHITECTURE.md                  # Detalles arquitectónicos del backend
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 4. Guía de Inicio Rápido

### Requisitos Previos
- Node.js v20+
- pnpm instalado globalmente (`npm i -g pnpm`)
- Instancia de PostgreSQL disponible

### Pasos de Instalación

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar variables de entorno (.env)
# DATABASE_URL="postgresql://usuario:password@localhost:5432/callvu_agenda?schema=public"

# 3. Generar cliente de Prisma
pnpm prisma:generate

# 4. Ejecutar pruebas con Vitest (TDD)
pnpm test

# 5. Iniciar en modo desarrollo
pnpm dev
```

---

## 5. Pruebas y TDD

La suite de pruebas se ejecuta con Vitest. Toda regla de negocio en la capa de `Service` se desarrolla bajo **TDD (Red -> Green -> Refactor)**:

```bash
# Correr todos los tests de la API
pnpm test
```

---

## 6. Convenciones

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `refactor:`)
- **Código**: TypeScript estricto, separación en Controller / Service / Repository
- **API**: RESTful, respuestas JSON con estructura consistente (`400 Bad Request` en fallos de Zod).
