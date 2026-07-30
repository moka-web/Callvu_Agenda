export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Callvu Agenda API',
    version: '1.0.0',
    description: 'Documentación oficial de la REST API para el motor de gestión de turnos Callvu Agenda.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor Local de Desarrollo',
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Verificar estado del servidor',
        responses: {
          '200': {
            description: 'Servidor operando correctamente',
          },
        },
      },
    },
    '/agendas': {
      get: {
        summary: 'Obtener todas las agendas',
        responses: {
          '200': { description: 'Lista de agendas' },
        },
      },
      post: {
        summary: 'Crear nueva agenda',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre: { type: 'string', example: 'Odontología General' },
                  duracionSlot: { type: 'number', example: 30 },
                  activa: { type: 'boolean', example: true },
                  horariosAtencion: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        diaSemana: { type: 'number', example: 1 },
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
          '201': { description: 'Agenda creada' },
          '400': { description: 'Error de validaciones Zod' },
        },
      },
    },
    '/clientes': {
      get: {
        summary: 'Obtener todos los clientes',
        responses: {
          '200': { description: 'Lista de clientes' },
        },
      },
      post: {
        summary: 'Registrar un nuevo cliente',
        responses: {
          '201': { description: 'Cliente creado' },
          '400': { description: 'Error de validación o teléfono duplicado' },
        },
      },
    },
    '/slots': {
      get: {
        summary: 'Calcular slots disponibles para una agenda y fecha',
        parameters: [
          { name: 'agendaId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'fecha', in: 'query', required: true, schema: { type: 'string', example: '2026-08-03' } },
        ],
        responses: {
          '200': { description: 'Lista de slots calculados con su disponibilidad' },
          '400': { description: 'Parámetros de consulta inválidos' },
        },
      },
    },
    '/turnos': {
      post: {
        summary: 'Reservar un nuevo turno',
        responses: {
          '201': { description: 'Turno creado' },
          '400': { description: 'Fuera de horario, solapamiento o error de validación' },
        },
      },
    },
  },
};
