# Callvu Agenda API — Backend REST Service

> Servicio Backend autónomo para el motor de gestión de turnos e integración con agendas inteligentes.

---

## 1. Visión y Arquitectura

El **Callvu Agenda API** es el servicio central de lógica de negocio encuadrado en una **arquitectura modular de 3 capas** (Controller / Service / Repository) complementada con una **capa de Servicios Externos**:

- **Controller**: Maneja peticiones HTTP y valida la entrada de datos en tiempo de ejecución con **Zod**.
- **Service**: Concentra la lógica del dominio (reglas de atención, validaciones de slots, reservas). Desarrollado obligatoriamente mediante **Test-Driven Development (TDD)**.
- **Repository**: Capa de abstracción de datos (`IAgendaRepository`, etc.) desacoplada de la infraestructura, implementada con **Prisma ORM** y **PostgreSQL**.
- **Services (Integraciones)**: Capa independiente (`src/services/`) para conectores externos como **Google Calendar API v3** y **WhatsApp Business API (Meta Cloud API)**.

```mermaid
graph TD
    Client["Cliente (Frontend / API Consumer)"] -->|HTTP REST| Controller["Controller Layer (Express + Zod Middleware)"]
    Controller -->|DTO Validado| Service["Domain Service Layer"]
    Service -->|Repository Interface| Repository["Repository Layer (Prisma ORM)"]
    Service -->|Integración Externa| ExtService["Services Layer (src/services/*)"]
    Repository -->|SQL| Database[(PostgreSQL Database)]
    ExtService -->|OAuth2 / REST| External["Google Calendar / WhatsApp Meta API"]
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
| Documentación | Swagger UI (`swagger-ui-express`) | UI interactiva para OpenAPI 3.0 en `/docs` |
| Servicios Externos | `googleapis` & Meta Cloud API | Integración con Google Calendar API v3 y WhatsApp Business API |
| Testing | Vitest + Supertest | Suite de pruebas unitarias e integración con TDD (39 tests) |

---

## 3. Estructura del Proyecto

```text
callvu-agenda-api/
├── prisma/
│   └── schema.prisma                # Esquema declarativo de base de datos PostgreSQL
├── src/
│   ├── modules/                     # Módulos del Dominio de Negocio
│   │   ├── agenda/                  # Módulo de Agendas y Horarios de Atención
│   │   ├── cliente/                 # Módulo de Clientes (Directorio y WhatsApp)
│   │   ├── slot/                    # Algoritmo dinámico de cálculo de disponibilidad
│   │   └── turno/                   # Módulo de Turnos y Gestión de Reservas
│   ├── services/                    # Capa de Servicios e Integraciones Externas
│   │   ├── calendar/                # Conector Google Calendar API (v3)
│   │   └── whatsapp/                # Conector WhatsApp Business API (Webhooks & Messaging)
│   ├── shared/                      # Infraestructura, Middlewares y Swagger
│   │   ├── errors/                  # Jerarquía de clases de error (AppError, NotFoundError, etc.)
│   │   ├── logger/                  # Logger estructurado con ISO timestamps
│   │   ├── middlewares/             # ErrorHandler centralizado y validadores Zod
│   │   └── swagger/                 # Definición OpenAPI 3.0 para Swagger UI
│   ├── config/                      # Configuración de entorno con Zod (.env)
│   ├── types/                       # Interfaces y tipos de dominio
│   ├── app.ts                       # Entrada de Express e Inyección de Dependencias
│   └── server.ts                    # Punto de entrada HTTP (Puerto 3000)
├── openspec/                        # Especificaciones y requerimientos (SDD)
│   └── specs/                       # Specs en formato Given/When/Then (RFC 2119)
├── ARCHITECTURE.md                  # Detalles arquitectónicos del backend
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 4. Endpoints y Documentación Swagger

La API cuenta con documentación interactiva en tiempo real expuesta a través de Swagger UI:

- **Documentación Swagger**: `http://localhost:3000/docs`
- **Health Check**: `GET /health`

### Resumen de Endpoints:

| Módulo | Método | Ruta | Descripción |
|--------|--------|------|-------------|
| **Agendas** | `POST` | `/agendas` | Crear una nueva agenda con horarios de atención |
| | `GET` | `/agendas` | Listar todas las agendas activas |
| | `GET` | `/agendas/:id` | Obtener detalle de una agenda |
| | `PATCH` | `/agendas/:id` | Actualizar configuración de una agenda |
| | `DELETE` | `/agendas/:id` | Eliminar una agenda |
| **Clientes** | `POST` | `/clientes` | Registrar cliente (valida teléfono único) |
| | `GET` | `/clientes` | Listar directorio de clientes |
| | `GET` | `/clientes/:id` | Obtener detalle de cliente |
| **Slots** | `GET` | `/slots?agendaId=UUID&fecha=YYYY-MM-DD` | Calcular slots disponibles y solapamientos |
| **Turnos** | `POST` | `/turnos` | Reservar turno (valida agenda, horario y solapamiento) |
| | `GET` | `/turnos/:id` | Obtener detalle de turno |
| | `GET` | `/turnos/agenda/:agendaId` | Listar turnos por agenda |
| | `PATCH` | `/turnos/:id/estado` | Cambiar estado (`confirmado`, `completado`, `cancelado`) |
| **Webhooks** | `GET` | `/webhooks/whatsapp` | Handshake de verificación de Meta Cloud API |
| | `POST` | `/webhooks/whatsapp` | Webhook receptor de mensajes de chat entrantes |

---

## 5. Variables de Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto basado en el siguiente esquema:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de Datos PostgreSQL
DATABASE_URL="postgresql://usuario:password@localhost:5432/callvu_agenda?schema=public"

# Google Calendar API (OAuth2)
GOOGLE_CLIENT_ID="tu_google_client_id"
GOOGLE_CLIENT_SECRET="tu_google_client_secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/oauth2callback"

# WhatsApp Business API (Meta Cloud API)
WHATSAPP_VERIFY_TOKEN="tu_token_de_verificacion_custom"
WHATSAPP_PHONE_NUMBER_ID="tu_phone_number_id_meta"
WHATSAPP_API_TOKEN="tu_system_user_access_token_meta"
```

---

## 6. Guía de Inicio Rápido

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

## 7. Pruebas y TDD

Toda la suite de pruebas se ejecuta con Vitest bajo metodología **Strict TDD (Red -> Green -> Refactor)**:

```bash
# Correr todos los tests de la API
pnpm test
```

Suite actual: **39 tests pasando exitosamente en 13 archivos de prueba (`13/13 test files passed`)**.
