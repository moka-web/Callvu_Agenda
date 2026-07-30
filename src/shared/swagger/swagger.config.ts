export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Callvu Agenda API — Backend REST Service',
    version: '1.0.0',
    description: `
Documentación interactiva de la REST API para **Callvu Agenda**.

### 🌟 Principios de la API:
- **Arquitectura**: Patrón Controller / Service / Repository desacoplado.
- **Validación Estricta**: Payloads validados en runtime mediante esquemas de **Zod**.
- **Respuestas de Error**: Formato estándar JSON con status HTTP adecuado (\`400 Bad Request\`, \`404 Not Found\`, \`409 Conflict\`, \`500 Internal Error\`).
    `,
  },
  tags: [
    { name: 'Health', description: 'Monitoreo de estado y disponibilidad del servidor' },
    { name: 'Agendas', description: 'Gestión de configuraciones de agendas, duraciones de slots y horarios de atención' },
    { name: 'Clientes', description: 'Directorio de clientes y registro por número de WhatsApp' },
    { name: 'Slots', description: 'Cálculo dinámico de franjas horarias y disponibilidad de atención' },
    { name: 'Turnos', description: 'Reserva, máquina de estados y control de solapamiento de turnos' },
    { name: 'Webhooks', description: 'Recepción e integración de eventos entrantes de WhatsApp Meta Cloud API' },
  ],
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor Local de Desarrollo',
    },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verificar disponibilidad del servidor',
        description: 'Endpoint ligero para health checks y balanceadores de carga. Retorna la hora UTC del servidor.',
        responses: {
          '200': {
            description: 'Servidor operando correctamente',
            content: {
              'application/json': {
                example: { status: 'ok', timestamp: '2026-07-30T17:00:00.000Z' },
              },
            },
          },
        },
      },
    },
    '/agendas': {
      get: {
        tags: ['Agendas'],
        summary: 'Listar todas las agendas',
        description: 'Retorna el catálogo completo de agendas configuradas en el sistema ordenadas descendentemente por fecha de creación.',
        responses: {
          '200': {
            description: 'Lista de agendas encontradas',
            content: {
              'application/json': {
                example: [
                  {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    nombre: 'Consulta Odontológica General',
                    descripcion: 'Atención presencial en consultorio 102',
                    duracionSlot: 30,
                    activa: true,
                    horariosAtencion: [{ diaSemana: 1, horaInicio: '09:00', horaFin: '17:00' }],
                    createdAt: '2026-07-30T15:00:00.000Z',
                  },
                ],
              },
            },
          },
        },
      },
      post: {
        tags: ['Agendas'],
        summary: 'Crear nueva agenda',
        description: 'Crea una nueva regla de agenda. `horariosAtencion` requiere `diaSemana` (0: Domingo a 6: Sábado) y rango horario `HH:MM` donde `horaInicio < horaFin`.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nombre', 'duracionSlot', 'horariosAtencion'],
                properties: {
                  nombre: { type: 'string', minLength: 3, example: 'Consultorio Médico' },
                  descripcion: { type: 'string', example: 'Atención especializada' },
                  duracionSlot: { type: 'number', example: 30, description: 'Duración en minutos por turno' },
                  activa: { type: 'boolean', default: true },
                  horariosAtencion: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['diaSemana', 'horaInicio', 'horaFin'],
                      properties: {
                        diaSemana: { type: 'number', example: 1, description: '0 (Domingo) a 6 (Sábado)' },
                        horaInicio: { type: 'string', example: '09:00' },
                        horaFin: { type: 'string', example: '17:00' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Agenda creada exitosamente' },
          '400': { description: 'Error de validación en DTO (Zod) o rango horario inválido' },
        },
      },
    },
    '/agendas/{id}': {
      get: {
        tags: ['Agendas'],
        summary: 'Obtener detalle de una agenda por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': { description: 'Detalle de la agenda' },
          '404': { description: 'Agenda no encontrada' },
        },
      },
      patch: {
        tags: ['Agendas'],
        summary: 'Actualizar configuración de una agenda',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre: { type: 'string', example: 'Consultorio Médico Renombrado' },
                  duracionSlot: { type: 'number', example: 45 },
                  activa: { type: 'boolean', example: false },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Agenda actualizada' },
          '400': { description: 'Error de validación' },
          '404': { description: 'Agenda no encontrada' },
        },
      },
      delete: {
        tags: ['Agendas'],
        summary: 'Eliminar una agenda',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '204': { description: 'Agenda eliminada correctamente' },
          '404': { description: 'Agenda no encontrada' },
        },
      },
    },
    '/clientes': {
      get: {
        tags: ['Clientes'],
        summary: 'Listar directorio de clientes',
        description: 'Obtiene todos los clientes registrados ordenados por fecha de creación.',
        responses: {
          '200': { description: 'Lista de clientes' },
        },
      },
      post: {
        tags: ['Clientes'],
        summary: 'Registrar un nuevo cliente',
        description: 'Crea el perfil de un cliente. El teléfono debe ser único ya que se utiliza como canal primario de WhatsApp.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nombre', 'telefono'],
                properties: {
                  nombre: { type: 'string', example: 'Carlos Gómez' },
                  telefono: { type: 'string', example: '+5491133334444' },
                  email: { type: 'string', format: 'email', example: 'carlos@example.com' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Cliente registrado' },
          '400': { description: 'Error de validación Zod o teléfono ya registrado' },
        },
      },
    },
    '/slots': {
      get: {
        tags: ['Slots'],
        summary: 'Calcular franjas de disponibilidad para una agenda y fecha',
        description: `
Calcula dinámicamente todos los bloques de tiempo (\`Slot\`) para un día específico (\`YYYY-MM-DD\`):
1. Comprueba si la agenda atiende en el día de la semana correspondiente.
2. Segmenta las horas de atención según la duración de slot de la agenda.
3. Cruza cada franja con los turnos activos reservado/confirmados para determinar \`disponible: true/false\`.
        `,
        parameters: [
          { name: 'agendaId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' }, example: '123e4567-e89b-12d3-a456-426614174000' },
          { name: 'fecha', in: 'query', required: true, schema: { type: 'string' }, example: '2026-08-03', description: 'Formato estrictamente YYYY-MM-DD' },
        ],
        responses: {
          '200': {
            description: 'Lista de slots calculados',
            content: {
              'application/json': {
                example: [
                  { fechaHora: '2026-08-03T09:00:00.000Z', disponible: true, agendaId: '123e4567-e89b-12d3-a456-426614174000' },
                  { fechaHora: '2026-08-03T09:30:00.000Z', disponible: false, agendaId: '123e4567-e89b-12d3-a456-426614174000' },
                ],
              },
            },
          },
          '400': { description: 'Parámetros de consulta faltantes o con formato inválido' },
        },
      },
    },
    '/turnos': {
      post: {
        tags: ['Turnos'],
        summary: 'Reservar un nuevo turno',
        description: `
Valida y genera una nueva reserva de turno:
- **Agenda Activa**: La agenda referenciada debe existir y estar activa.
- **Cliente Existente**: El cliente debe estar registrado.
- **Horario de Atención**: La fechaHora debe caer dentro de las reglas de atención.
- **Sin Solapamientos**: Rechaza reservas si el intervalo colisiona con un turno existente activo.
        `,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['agendaId', 'clienteId', 'fechaHora'],
                properties: {
                  agendaId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                  clienteId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174001' },
                  fechaHora: { type: 'string', format: 'date-time', example: '2026-08-03T10:00:00.000Z' },
                  duracion: { type: 'number', example: 30, description: 'Opcional. Por defecto usa la duración de la agenda' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Turno reservado exitosamente' },
          '400': { description: 'Solapamiento de turno, fuera de horario de atención o error de validación DTO' },
        },
      },
    },
    '/turnos/{id}/estado': {
      patch: {
        tags: ['Turnos'],
        summary: 'Cambiar el estado de un turno',
        description: 'Permite avanzar el estado de un turno (`pendiente`, `confirmado`, `completado`, `cancelado`, `no-show`). Al cancelar un turno, la franja horaria vuelve a quedar libre en los `/slots`.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['estado'],
                properties: {
                  estado: { type: 'string', enum: ['pendiente', 'confirmado', 'completado', 'cancelado', 'no-show'], example: 'completado' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Estado del turno actualizado' },
          '400': { description: 'Estado inválido' },
          '404': { description: 'Turno no encontrado' },
        },
      },
    },
    '/webhooks/whatsapp': {
      get: {
        tags: ['Webhooks'],
        summary: 'Handshake de verificación de Meta Cloud API',
        description: 'Endpoint invocado automáticamente por los servidores de Meta al configurar la URL del Webhook. Valida `hub.verify_token` y responde con `hub.challenge`.',
        parameters: [
          { name: 'hub.mode', in: 'query', schema: { type: 'string', example: 'subscribe' } },
          { name: 'hub.verify_token', in: 'query', schema: { type: 'string', example: 'callvu_secret_verify_token_2026' } },
          { name: 'hub.challenge', in: 'query', schema: { type: 'string', example: 'challenge_123456' } },
        ],
        responses: {
          '200': { description: 'Retorna el challenge de Meta (Handshake OK)' },
          '403': { description: 'Token de verificación de WhatsApp inválido' },
        },
      },
      post: {
        tags: ['Webhooks'],
        summary: 'Recepción de eventos y mensajes entrantes de WhatsApp',
        description: 'Receptor de notificaciones de mensajes enviados por clientes desde WhatsApp. Extrae el remitente y cuerpo del texto para procesamiento automático.',
        responses: {
          '200': { description: 'Evento recibido procesado (`EVENT_RECEIVED`)' },
        },
      },
    },
  },
};
