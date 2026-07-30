# Callvu Agenda API — Backend REST Service

> Servicio Backend autónomo para el motor de gestión de turnos e integración con agendas inteligentes.

---

## 1. Visión y Arquitectura

El **Callvu Agenda API** es el servicio central de lógica de negocio encuadrado en una **arquitectura modular de 3 capas** (Controller / Service / Repository) complementada con una **capa de Servicios Externos**:

- **Controller**: Maneja peticiones HTTP y valida la entrada de datos en tiempo de ejecución con **Zod**.
- **Service**: Concentra la lógica del dominio (reglas de atención, validaciones de slots, reservas). Desarrollado obligatoriamente mediante **Test-Driven Development (TDD)**.
- **Repository**: Capa de abstracción de datos (`IAgendaRepository`, etc.) desacoplada de la infraestructura, implementada con **Prisma ORM** y **PostgreSQL**.
- **Services (Integraciones)**: Capa independiente (`src/services/`) para conectores externos como **Google Calendar API** y **WhatsApp Business API**.

```mermaid
graph TD
    Client["Cliente (Frontend / API Consumer)"] -->|HTTP REST| Controller["Controller Layer (Express + Zod Middleware)"]
    Controller -->|DTO Validado| Service["Domain Service Layer"]
    Service -->|Repository Interface| Repository["Repository Layer (Prisma ORM)"]
    Service -->|Integración Externa| ExtService["Services Layer (src/services/*)"]
    Repository -->|SQL| Database[(PostgreSQL Database)]
    ExtService -->|OAuth2 / REST| External["Google Calendar / WhatsApp"]
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
| Servicios Externos | Google APIs (`googleapis`) | Integración con Google Calendar API v3 |
| Testing | Vitest + Supertest | Suite de pruebas unitarias e integración con TDD |

---

## 3. Estructura del Proyecto

```text
callvu-agenda-api/
├── prisma/
│   └── schema.prisma                # Esquema declarativo de base de datos
├── src/
│   ├── modules/                     # Módulos del Dominio de Negocio
│   │   ├── agenda/                  # Módulo de Agendas y Horarios de Atención
│   │   ├── cliente/                 # Módulo de Clientes (Directorio y WhatsApp)
│   │   ├── slot/                    # Algoritmo dinámico de cálculo de disponibilidad
│   │   └── turno/                   # Módulo de Turnos y Gestión de Reservas
│   ├── services/                    # Capa de Servicios e Integraciones Externas
│   │   ├── calendar/                # Conector Google Calendar API (v3)
│   │   └── whatsapp/                # Conector WhatsApp Business API (próximo)
│   ├── shared/                      # Infraestructura, Middlewares y Swagger
│   ├── config/                      # Configuración de entorno con Zod (.env)
│   ├── types/                       # Interfaces y tipos de dominio
│   ├── app.ts                       # Entrada de Express e Inyección de Dependencias
│   └── server.ts                    # Punto de entrada HTTP
├── openspec/                        # Especificaciones y requerimientos (SDD)
├── ARCHITECTURE.md                  # Detalles arquitectónicos del backend
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 4. Guía de Inicio Rápido

### Pasos de Instalación

```bash
# 1. Instalar dependencias
pnpm install

# 2. Generar cliente de Prisma
pnpm prisma:generate

# 3. Ejecutar pruebas con Vitest (TDD)
pnpm test

# 4. Iniciar en modo desarrollo
pnpm dev
```

---

## 5. Pruebas y TDD

La suite de pruebas se ejecuta con Vitest. Toda regla de negocio y conector externo se desarrolla bajo **TDD (Red -> Green -> Refactor)**:

```bash
# Correr todos los tests de la API
pnpm test
```
