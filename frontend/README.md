# Callvu Agenda — Frontend App

> Aplicación web SPA (Single Page Application) construida con **React 19**, **TypeScript**, **Vite** y **React Router DOM**. Interfaz intuitiva y adaptativa dividida en un portal de clientes para reserva directa y un panel de administración para operadores.

---

## ⚡ Inicio Rápido

### Requisitos Previos
- **Node.js**: v18+ o v20+
- **pnpm**: v9+ (o `npm`/`yarn`)

### Comandos de Ejecución

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar servidor de desarrollo (http://localhost:5173)
pnpm dev

# 3. Compilar para producción
pnpm run build
```

---

## 🗺️ Estructura del Proyecto

El código fuente sigue los principios de **Screaming Architecture** y separación clara entre Páginas (`pages`) y Componentes (`components`):

```text
frontend/
├── src/
│   ├── pages/                   # Páginas de nivel superior (Rutas)
│   │   ├── ClientPage.tsx       # Ruta / o /reservar (Portal público de clientes)
│   │   └── AdminPage.tsx        # Ruta /admin (Panel de operadores)
│   │
│   ├── components/              # Componentes de UI desacoplados y reutilizables
│   │   ├── ClientNavbar.tsx     # Encabezado del portal de cliente
│   │   ├── AdminNavbar.tsx      # Encabezado con pestañas de administración
│   │   ├── ReservaTurnoForm.tsx # Formulario interactivo de reserva y slots
│   │   ├── GestionAgendasView.tsx   # Panel CRUD de agendas y horarios
│   │   ├── DirectorioClientesView.tsx # Panel de directorio de clientes
│   │   ├── ListaTurnosView.tsx      # Panel de control y cancelación de turnos
│   │   └── WhatsAppSimulatorView.tsx # Simulador de respuestas del bot WhatsApp
│   │
│   ├── services/
│   │   └── api.ts               # Cliente REST con fallback automático a Mock Mode
│   │
│   ├── types/
│   │   └── index.ts             # Definiciones e interfaces TypeScript del dominio
│   │
│   ├── App.tsx                  # Enrutamiento principal (React Router DOM)
│   └── index.css                # Sistema de diseño, tokens CSS y modo oscuro
│
├── index.html                   # HTML base con fuentes Google (Outfit + Plus Jakarta Sans)
├── package.json                 # Configuración de dependencias y scripts
└── vite.config.ts               # Bundler Vite
```

---

## 🏛️ Portales e Interfaces

### 1. Portal del Cliente (`/` o `/reservar`)
- **Objetivo**: Permitir a usuarios finales agendar citas de forma rápida y autónoma.
- **Flujo**:
  1. Selección de servicio/agenda y fecha deseada.
  2. Grilla dinámica de horarios (*slots*) calculados según la disponibilidad.
  3. Formulario de contacto (Nombre, Email, Teléfono/WhatsApp).
  4. Confirmación visual instantánea con recordatorio por WhatsApp y Google Calendar.

### 2. Panel Administrador (`/admin`)
- **Objetivo**: Permitir al operador gestionar agendas, clientes y turnos del negocio.
- **Secciones**:
  - **⚙️ Agendas**: Alta de servicios con duración (15-60 min), horarios de atención (inicio/fin) y días activos.
  - **👥 Clientes**: Directorio searchable de clientes registrados con estado de WhatsApp.
  - **📋 Turnos Reservados**: Control general de reservas activas con opción de cancelación.
  - **💬 Bot WhatsApp**: Entorno de pruebas interactivo que simula llamadas al webhook `POST /webhooks/whatsapp`.

---

## 🔌 Integración con la API y Modo Offline

La aplicación incluye un cliente resiliente en `src/services/api.ts`:

| Estado de la API | Comportamiento | Insignia |
|---|---|---|
| **Conectada** (`http://localhost:3000`) | Realiza peticiones REST a Express y PostgreSQL | 🟢 `API Conectada` |
| **Offline / Desconectada** | Conmuta a modo simulación interactivo usando `localStorage` | 🟡 `Modo Offline / Mock` |

---

## 🎨 Sistema de Diseño

- **Tipografías**: Google Fonts (*Outfit* para títulos, *Plus Jakarta Sans* para cuerpo).
- **Estilo**: Modern Dark Theme con efectos Glassmorphism (`backdrop-filter: blur(16px)`).
- **Iconografía**: `lucide-react`.

---

## 📋 Verificación de Calidad

```bash
# Validar compilación de TypeScript y bundler Vite
pnpm run build
```
