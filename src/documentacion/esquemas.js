import { z } from 'zod';
import {
  registrarUsuarioSchema,
  iniciarSesionSchema,
  postulacionSchema,
  crearAdminSchema,
  cambiarEstadoCuentaSchema,
  resolverSolicitudSchema
} from '../schemas/auth-validations.js';
import {
  productoSchema,
  artesanoSchema,
  actualizarEstadoArtesanoSchema,
  standSchema,
  localidadSchema,
  ubicacionSchema
} from '../schemas/validations.js';

const toOpenApi = (schema) => z.toJSONSchema(schema, { target: 'openapi-3.0', io: 'input' });

// Esquemas de Entrada (convertidos desde validadores Zod)
export const RegistroInput = toOpenApi(registrarUsuarioSchema);
export const LoginInput = toOpenApi(iniciarSesionSchema);
export const PostulacionInput = toOpenApi(postulacionSchema);
export const CrearAdminInput = toOpenApi(crearAdminSchema);
export const CambiarEstadoCuentaInput = toOpenApi(cambiarEstadoCuentaSchema);
export const ResolverSolicitudInput = toOpenApi(resolverSolicitudSchema);

export const ProductoInput = toOpenApi(productoSchema);
export const ProductoUpdateInput = toOpenApi(productoSchema.partial());

export const ArtesanoInput = toOpenApi(artesanoSchema);
export const ArtesanoUpdateInput = toOpenApi(artesanoSchema.partial());
export const ArtesanoEstadoInput = toOpenApi(actualizarEstadoArtesanoSchema);

export const StandInput = toOpenApi(standSchema);
export const StandUpdateInput = toOpenApi(standSchema.partial());

export const LocalidadInput = toOpenApi(localidadSchema);
export const LocalidadUpdateInput = toOpenApi(localidadSchema.partial());

export const UbicacionInput = toOpenApi(ubicacionSchema);
export const UbicacionUpdateInput = toOpenApi(ubicacionSchema.partial());

// Esquemas de Respuesta descriptos con properties/required
export const ErrorApi = {
  type: 'object',
  properties: {
    mensaje: {
      type: 'string',
      example: 'Los datos enviados son inválidos.'
    },
    errores: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          campo: { type: 'string', example: 'nombre' },
          mensaje: { type: 'string', example: 'El nombre del producto es obligatorio' }
        },
        required: ['campo', 'mensaje']
      }
    }
  },
  required: ['mensaje'],
  example: {
    mensaje: 'Los datos enviados son inválidos.',
    errores: [
      {
        campo: 'nombre',
        mensaje: 'El nombre del producto es obligatorio'
      }
    ]
  }
};

export const UsuarioResponse = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
    nombre: { type: 'string', example: 'Juan Pérez' },
    email: { type: 'string', format: 'email', example: 'artesano@poncho.gob.ar' },
    rol: { type: 'string', enum: ['ADMINISTRADOR', 'ARTESANO', 'POSTULANTE'], example: 'ARTESANO' },
    activo: { type: 'boolean', example: true },
    createdAt: { type: 'string', format: 'date-time', example: '2026-07-15T14:30:00.000Z' },
    ultimoAcceso: { type: 'string', format: 'date-time', nullable: true }
  },
  required: ['id', 'nombre', 'email', 'rol', 'activo', 'createdAt']
};

export const LoginResponse = {
  type: 'object',
  properties: {
    mensaje: { type: 'string', example: 'Credenciales verificadas correctamente.' },
    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
    usuario: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        nombre: { type: 'string', example: 'Juan Pérez' },
        email: { type: 'string', format: 'email', example: 'artesano@poncho.gob.ar' },
        rol: { type: 'string', example: 'ARTESANO' },
        artesanoId: { type: 'string', format: 'uuid', nullable: true }
      },
      required: ['id', 'nombre', 'email', 'rol']
    }
  },
  required: ['mensaje', 'token', 'usuario']
};

export const PostulacionResponse = {
  type: 'object',
  properties: {
    mensaje: { type: 'string', example: 'Postulación registrada correctamente. Estado pendiente de aprobación.' },
    usuario: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        nombre: { type: 'string' },
        email: { type: 'string', format: 'email' },
        rol: { type: 'string', example: 'POSTULANTE' }
      },
      required: ['id', 'nombre', 'email', 'rol']
    },
    artesano: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        estado: { type: 'string', example: 'PENDIENTE' }
      },
      required: ['id', 'estado']
    },
    solicitud: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        estado: { type: 'string', example: 'PENDIENTE' }
      },
      required: ['id', 'estado']
    }
  },
  required: ['mensaje', 'usuario', 'artesano', 'solicitud']
};

export const PerfilMeResponse = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    nombre: { type: 'string', example: 'Juan Pérez' },
    email: { type: 'string', format: 'email', example: 'artesano@poncho.gob.ar' },
    rol: { type: 'string', example: 'ARTESANO' },
    activo: { type: 'boolean', example: true },
    createdAt: { type: 'string', format: 'date-time' },
    ultimoAcceso: { type: 'string', format: 'date-time', nullable: true },
    artesano: {
      type: 'object',
      nullable: true,
      properties: {
        id: { type: 'string', format: 'uuid' },
        nombre: { type: 'string' },
        apellido: { type: 'string', nullable: true },
        telefono: { type: 'string', nullable: true },
        estado: { type: 'string' }
      }
    }
  },
  required: ['id', 'nombre', 'email', 'rol', 'activo', 'createdAt']
};

export const ProductoResponse = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    nombre: { type: 'string', example: 'Poncho de Vicuña' },
    precio: { type: 'number', example: 850000 },
    artesanoId: { type: 'string', format: 'uuid', nullable: true, example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'nombre', 'precio']
};

export const ArtesanoResponse = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
    nombre: { type: 'string', example: 'Juan' },
    apellido: { type: 'string', nullable: true, example: 'Poncho' },
    telefono: { type: 'string', nullable: true, example: '+54 383 4123456' },
    estado: { type: 'string', enum: ['PENDIENTE', 'APROBADO', 'RECHAZADO'], example: 'APROBADO' },
    usuarioId: { type: 'string', format: 'uuid', nullable: true },
    localidadId: { type: 'integer', nullable: true, example: 1 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'nombre', 'estado']
};

export const StandResponse = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    estado: { type: 'string', example: 'disponible' },
    coordenadas: { type: 'string', nullable: true, example: '-28.4689,-65.7795' },
    ubicacionId: { type: 'integer', example: 1 },
    artesanoId: { type: 'string', format: 'uuid', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'estado', 'ubicacionId']
};

export const StandPaginadoResponse = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: { $ref: '#/components/schemas/StandResponse' }
    },
    meta: {
      type: 'object',
      properties: {
        total: { type: 'integer', example: 25 },
        paginaActual: { type: 'integer', example: 1 },
        limite: { type: 'integer', example: 10 },
        totalPaginas: { type: 'integer', example: 3 }
      },
      required: ['total', 'paginaActual', 'limite', 'totalPaginas']
    }
  },
  required: ['data', 'meta']
};

export const SolicitudResponse = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    estado: { type: 'string', enum: ['PENDIENTE', 'APROBADA', 'RECHAZADA'], example: 'PENDIENTE' },
    motivo: { type: 'string', nullable: true, example: 'Tejeduría tradicional calchaquí' },
    usuarioId: { type: 'string', format: 'uuid' },
    artesanoId: { type: 'string', format: 'uuid', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'estado', 'usuarioId']
};

export const ResolverSolicitudResponse = {
  type: 'object',
  properties: {
    mensaje: { type: 'string', example: 'Solicitud aprobada con éxito.' },
    solicitud: { $ref: '#/components/schemas/SolicitudResponse' }
  },
  required: ['mensaje', 'solicitud']
};

export const LocalidadResponse = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    nombre: { type: 'string', example: 'San Fernando del Valle de Catamarca' },
    provincia: { type: 'string', nullable: true, example: 'Catamarca' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'nombre']
};

export const UbicacionResponse = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    pabellon: { type: 'string', example: 'Pabellón Artesanías Tradicionales' },
    sector: { type: 'string', example: 'Sector A' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'pabellon', 'sector']
};

export const esquemas = {
  ErrorApi,
  RegistroInput,
  LoginInput,
  PostulacionInput,
  CrearAdminInput,
  CambiarEstadoCuentaInput,
  ResolverSolicitudInput,
  ProductoInput,
  ProductoUpdateInput,
  ArtesanoInput,
  ArtesanoUpdateInput,
  ArtesanoEstadoInput,
  StandInput,
  StandUpdateInput,
  LocalidadInput,
  LocalidadUpdateInput,
  UbicacionInput,
  UbicacionUpdateInput,
  UsuarioResponse,
  LoginResponse,
  PostulacionResponse,
  PerfilMeResponse,
  ProductoResponse,
  ArtesanoResponse,
  StandResponse,
  StandPaginadoResponse,
  SolicitudResponse,
  ResolverSolicitudResponse,
  LocalidadResponse,
  UbicacionResponse
};

