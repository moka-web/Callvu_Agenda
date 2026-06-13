# Callvu Agenda — Motor de Gestión de Turnos

> Sistema de turnos inteligente con gestión de agendas múltiples, integrado con WhatsApp y Google Calendar.
> Frontend de administración y reservas construido con Next.js.

---

## Visión del Producto

Callvu Agenda tiene dos capas:

1. **Motor de Gestión (Backend)**: La lógica central que orquesta agendas, disponibilidad, reservas y notificaciones. Expone una API REST consumida por el frontend y por las integraciones externas.
2. **Panel de Administración (Frontend)**: Interfaz web donde los operadores gestionan agendas, visualizan turnos y configuran el sistema. Los clientes finales reservan principalmente vía WhatsApp.

El sistema permite:
- Crear y administrar múltiples agendas (profesionales, consultorios, servicios)
- Reservar, reprogramar y cancelar turnos
- Sincronizar disponibilidad en tiempo real con Google Calendar
- Enviar confirmaciones, recordatorios y gestionar conversaciones vía WhatsApp
- Visualizar y operar todo desde un panel web

---

## Tech Stack

### Backend

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Runtime | Node.js (v20 LTS) | Migración planificada a NestJS |
| Lenguaje | TypeScript | Strict mode |
| API | Express | Migra a NestJS controllers a futuro |
| Base de Datos | **⚠️ POR DEFINIR** | Ver [Decisiones Pendientes](#decisiones-pendientes) |
| Integraciones | WhatsApp Business API, Google Calendar API | APIs oficiales |
| Testing | **⚠️ POR DEFINIR** | Jest recomendado |

### Frontend

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Framework | Next.js (App Router) | SSR/SSG según la ruta |
| Lenguaje | TypeScript | Shared types con backend |
| Estilos | **⚠️ POR DEFINIR** | Ver [Decisiones Pendientes](#decisiones-pendientes) |
| State Management | **⚠️ POR DEFINIR** | Zustand / React Context / TanStack Query |
| UI Components | **⚠️ POR DEFINIR** | shadcn/ui recomendado |
| Testing | **⚠️ POR DEFINIR** | Vitest + Testing Library recomendado |

---

## Arquitectura de Alto Nivel

```
┌──────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                          │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌───────────────────┐  │
│  │ Dashboard│ │ Agendas  │ │  Turnos   │ │ Configuración     │  │
│  └────┬─────┘ └────┬─────┘ └─────┬─────┘ └────────┬──────────┘  │
│       └────────────┴─────────────┴────────────────┘             │
│                          │ fetch / Server Actions               │
└──────────────────────────┼──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    API REST (Express)                           │
│           /agendas  /turnos  /clientes  /webhooks               │
└──────────┬──────────┬──────────┬───────────────────────────────┘
           │          │          │
     ┌─────▼────┐ ┌───▼────┐ ┌──▼───────────────┐
     │ Agenda   │ │ Turno  │ │ Notificaciones   │
     │ Service  │ │ Service│ │ Service           │
     └─────┬────┘ └───┬────┘ └──┬───────┬───────┘
           │          │         │       │
      ┌────▼──────────▼────┐ ┌─▼────┐ ┌▼──────────┐
      │    Base de Datos   │ │ GCal │ │ WhatsApp  │
      │   (por definir)    │ │ API  │ │ Business  │
      └────────────────────┘ └──────┘ └───────────┘
```

---

## Modelo de Dominio (Draft)

### Entidades Core

- **Agenda**: Representa un recurso reservable (profesional, sala, servicio). Tiene horarios de atención, duración de slots y reglas de negocio.
- **Turno**: Una reserva concreta en una agenda. Estados: `pendiente` → `confirmado` → `completado` | `cancelado` | `no-show`.
- **Slot**: Unidad mínima de tiempo disponible. Calculado dinámicamente a partir de la agenda y los turnos existentes.
- **Cliente**: Quien reserva el turno. Identificado por teléfono (WhatsApp) como canal primario.

### Flujo Principal

```
Cliente envía mensaje → WhatsApp Webhook → Parseo de intención
    → Consulta disponibilidad (Slots) → Reserva turno
    → Crea evento en Google Calendar → Confirma por WhatsApp
```

---

## Integraciones

### WhatsApp Business API

- **Webhook entrante**: Recibe mensajes del cliente (reservas, cancelaciones, consultas)
- **Mensajes salientes**: Confirmaciones, recordatorios (24h antes), re-agendamiento
- **Templates**: Mensajes pre-aprobados por Meta para notificaciones proactivas

### Google Calendar API

- **Sync bidireccional**: Los turnos creados en Callvu se reflejan en GCal y viceversa
- **Disponibilidad**: Consulta eventos existentes para calcular slots libres reales
- **OAuth2**: Cada profesional conecta su calendario personal

---

## Estructura del Proyecto (Propuesta)

### Monorepo

```
callvu-agenda/
├── apps/
│   ├── api/                  # Backend (Express → NestJS)
│   └── web/                  # Frontend (Next.js)
├── packages/
│   └── shared/               # Tipos, constantes, utils compartidos
├── package.json              # Workspace root
└── README.md
```

### Backend (`apps/api/`)

```
apps/api/
├── src/
│   ├── config/               # Variables de entorno, conexión DB
│   ├── modules/
│   │   ├── agenda/           # CRUD agendas, reglas de disponibilidad
│   │   ├── turno/            # Reservas, estados, transiciones
│   │   ├── slot/             # Cálculo de disponibilidad
│   │   ├── cliente/          # Gestión de clientes
│   │   ├── whatsapp/         # Webhook handler, message sender
│   │   └── calendar/         # Google Calendar sync
│   ├── shared/               # Utils, middlewares, error handling
│   └── app.ts                # Entry point
├── tests/
├── .env.example
├── package.json
└── tsconfig.json
```

> **Nota**: Esta estructura modular facilita la migración a NestJS — cada carpeta en `modules/` se convierte en un módulo NestJS.

### Frontend (`apps/web/`)

```
apps/web/
├── src/
│   ├── app/                  # App Router (páginas y layouts)
│   │   ├── (auth)/           # Grupo de rutas: login, registro
│   │   ├── (dashboard)/      # Grupo de rutas: panel principal
│   │   │   ├── agendas/      # Gestión de agendas
│   │   │   ├── turnos/       # Vista de turnos (lista, calendario)
│   │   │   ├── clientes/     # Directorio de clientes
│   │   │   └── config/       # Configuración del sistema
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing / redirect
│   ├── components/
│   │   ├── ui/               # Componentes base (Button, Input, Modal)
│   │   ├── agenda/           # Componentes de dominio: agenda
│   │   ├── turno/            # Componentes de dominio: turnos
│   │   └── layout/           # Sidebar, Header, Navigation
│   ├── hooks/                # Custom hooks (useAgendas, useTurnos)
│   ├── lib/                  # API client, utils, formatters
│   ├── types/                # Tipos locales del frontend
│   └── styles/               # Estilos globales, tokens
├── public/
├── .env.local.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

> **Nota**: Se usa App Router con route groups `(auth)` y `(dashboard)` para separar layouts sin afectar la URL. Las páginas del dashboard comparten sidebar y header; las de auth tienen layout limpio.

---

## Vistas del Frontend (MVP)

Estas son las pantallas que el frontend necesita implementar. El usuario primario es el **operador/administrador**, no el cliente final (que interactúa vía WhatsApp).

### Dashboard
- Resumen del día: turnos próximos, métricas básicas (total reservados, cancelados, completados)
- Accesos rápidos a agendas activas

### Agendas
- **Lista de agendas**: Tabla con nombre, profesional, estado (activa/inactiva)
- **Crear/Editar agenda**: Formulario con horarios de atención, duración de slot, días laborables, excepciones
- **Detalle de agenda**: Vista de disponibilidad + turnos del día/semana

### Turnos
- **Vista calendario**: Calendario semanal/diario con turnos como bloques (drag & drop a futuro)
- **Vista lista**: Tabla filtrable por fecha, agenda, estado
- **Crear turno manual**: Modal para que el operador cargue un turno desde el panel
- **Detalle de turno**: Info del cliente, estado, acciones (confirmar, cancelar, marcar no-show)

### Clientes
- **Directorio**: Lista de clientes con historial de turnos
- **Detalle**: Datos de contacto, turnos pasados y próximos

### Configuración
- Conexión de Google Calendar (OAuth2 flow)
- Configuración de WhatsApp (token, número)
- Ajustes generales (timezone, idioma)

### Estrategia de Rendering

| Ruta | Estrategia | Razón |
|------|-----------|-------|
| `/login` | SSR | SEO no importa, pero necesita ser rápida |
| `/dashboard` | SSR + Client | Datos en tiempo real, necesita hidratación |
| `/agendas` | SSR | Lista que cambia poco, puede cachear |
| `/turnos` | CSR (Client) | Interacción pesada (calendario, filtros, drag) |
| `/clientes` | SSR + Client | Lista paginada server-side, detalle client-side |
| `/config` | CSR | Formularios interactivos, sin necesidad de SSR |

> **Nota**: Next.js App Router usa Server Components por defecto. Solo se marcan como `'use client'` los componentes que necesitan interactividad (estado, eventos, hooks del browser).

---

## Roadmap MVP

### Fase 1 — Foundation
- [ ] Setup del monorepo (workspaces, TypeScript, ESLint, Prettier)
- [ ] Definir modelo de datos y elegir DB
- [ ] CRUD de Agendas (API)
- [ ] Cálculo de slots disponibles
- [ ] Setup Next.js (App Router, layout base, design system)

### Fase 2 — Core Business
- [ ] Reserva de turnos (crear, cancelar, reprogramar) — API
- [ ] Máquina de estados del turno
- [ ] Validaciones de negocio (solapamiento, horarios, límites)
- [ ] Panel: CRUD de agendas (lista, crear, editar)
- [ ] Panel: Vista de turnos (lista + calendario básico)

### Fase 3 — Google Calendar
- [ ] OAuth2 flow para conectar calendarios
- [ ] Crear eventos al reservar turno
- [ ] Sync de disponibilidad (leer eventos existentes)
- [ ] Panel: Pantalla de conexión de calendario en config

### Fase 4 — WhatsApp
- [ ] Webhook para recibir mensajes
- [ ] Flujo conversacional básico (reservar, cancelar, consultar)
- [ ] Templates de notificación (confirmación, recordatorio)
- [ ] Panel: Configuración de WhatsApp en config

### Fase 5 — Polish
- [ ] Manejo de errores robusto (API + UI error boundaries)
- [ ] Logging y observabilidad
- [ ] Rate limiting y seguridad básica
- [ ] Documentación de API (Swagger/OpenAPI)
- [ ] Dashboard con métricas del día
- [ ] Directorio de clientes

---

## Decisiones Pendientes

> Estas decisiones necesitan resolverse antes o durante la Fase 1.

| # | Capa | Decisión | Opciones | Estado |
|---|------|----------|----------|--------|
| 1 | Backend | Base de datos | PostgreSQL / MongoDB / Supabase | ⚠️ Pendiente |
| 2 | Backend | ORM / Query builder | Prisma / TypeORM / Drizzle / Mongoose | ⚠️ Pendiente |
| 3 | Full | Testing framework | Jest / Vitest | ⚠️ Pendiente |
| 4 | Backend | Autenticación API | JWT / API Keys / ambos | ⚠️ Pendiente |
| 5 | Full | Hosting / Deploy | Vercel (front) + Railway (API) / todo en Railway / AWS | ⚠️ Pendiente |
| 6 | Backend | WhatsApp provider | Meta Cloud API directo / Twilio / 360dialog | ⚠️ Pendiente |
| 7 | Full | Manejo de zonas horarias | UTC interno + conversión en API / timezone por agenda | ⚠️ Pendiente |
| 8 | Frontend | Librería de estilos | Tailwind CSS / Vanilla CSS / CSS Modules | ⚠️ Pendiente |
| 9 | Frontend | UI Components | shadcn/ui / Radix primitives / Headless UI | ⚠️ Pendiente |
| 10 | Frontend | State & data fetching | TanStack Query / SWR / Zustand / React Context | ⚠️ Pendiente |
| 11 | Frontend | Autenticación panel | NextAuth.js / Clerk / custom JWT | ⚠️ Pendiente |
| 12 | Frontend | Componente calendario | FullCalendar / react-big-calendar / custom | ⚠️ Pendiente |
| 13 | Full | Monorepo tooling | npm workspaces / Turborepo / pnpm workspaces | ⚠️ Pendiente |

---

## Variables de Entorno

### Backend (`apps/api/.env`)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=

# Google Calendar
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

# WhatsApp
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=

# General
JWT_SECRET=
```

### Frontend (`apps/web/.env.local`)

```env
# API Connection
NEXT_PUBLIC_API_URL=http://localhost:3000

# Auth (depende de la decisión #11)
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3001

# Google OAuth (si se reutiliza el flow del backend)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## Cómo Correr (cuando esté implementado)

```bash
# Instalar dependencias (desde la raíz del monorepo)
npm install

# Copiar variables de entorno
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local

# Desarrollo — ambos servicios
npm run dev

# Solo backend
npm run dev --workspace=apps/api

# Solo frontend
npm run dev --workspace=apps/web

# Tests
npm test
```

---

## Convenciones

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, etc.)
- **Branches**: `feat/nombre`, `fix/nombre`, `chore/nombre`
- **Código**: TypeScript strict, ESLint + Prettier
- **API**: RESTful, respuestas JSON con estructura consistente
