import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  productoSchema,
  artesanoSchema,
  standSchema
} from '../schemas/validations.js';
import {
  registrarUsuarioSchema,
  iniciarSesionSchema,
  postulacionSchema,
  cambiarEstadoCuentaSchema,
  resolverSolicitudSchema
} from '../schemas/auth-validations.js';

describe('2.3 Pruebas del esquema - Validaciones unitarias con safeParse', () => {
  describe('productoSchema (Alta de producto)', () => {
    const casosProducto = [
      {
        nombre: 'Caso válido: datos mínimos completos',
        entrada: { nombre: 'Poncho Catamarqueño', precio: 45000 },
        valido: true
      },
      {
        nombre: 'Caso válido: precio decimal positivo',
        entrada: { nombre: 'Vasija de greda', precio: 12500.5 },
        valido: true
      },
      {
        nombre: 'Caso inválido: falta campo nombre',
        entrada: { precio: 5000 },
        valido: false,
        campoError: 'nombre'
      },
      {
        nombre: 'Caso inválido: nombre con menos de 2 caracteres',
        entrada: { nombre: 'A', precio: 5000 },
        valido: false,
        campoError: 'nombre'
      },
      {
        nombre: 'Caso inválido: falta campo precio',
        entrada: { nombre: 'Poncho' },
        valido: false,
        campoError: 'precio'
      },
      {
        nombre: 'Caso inválido: precio negativo',
        entrada: { nombre: 'Poncho', precio: -500 },
        valido: false,
        campoError: 'precio'
      },
      {
        nombre: 'Caso inválido: precio igual a 0',
        entrada: { nombre: 'Poncho', precio: 0 },
        valido: false,
        campoError: 'precio'
      },
      {
        nombre: 'Caso inválido: precio como string alfanumérico',
        entrada: { nombre: 'Poncho', precio: 'gratis' },
        valido: false,
        campoError: 'precio'
      },
      {
        nombre: 'Caso inválido (campo adicional rechazado): artesanoId en el alta de producto',
        entrada: { nombre: 'Poncho', precio: 5000, artesanoId: 'uuid-1234-abcd' },
        valido: false,
        campoError: 'artesanoId'
      },
      {
        nombre: 'Caso inválido (campo adicional rechazado): campos arbitrarios no permitidos',
        entrada: { nombre: 'Poncho', precio: 5000, rol: 'ADMINISTRADOR', activo: true },
        valido: false
      }
    ];

    for (const caso of casosProducto) {
      it(caso.nombre, () => {
        const resultado = productoSchema.safeParse(caso.entrada);
        assert.strictEqual(
          resultado.success,
          caso.valido,
          `Se esperaba success=${caso.valido} para ${JSON.stringify(caso.entrada)} pero fue ${resultado.success}`
        );

        if (!caso.valido && caso.campoError) {
          const caminosDeError = resultado.error.issues.flatMap((i) =>
            i.path.length > 0 ? [i.path.join('.')] : (i.keys || [])
          );
          assert.ok(
            caminosDeError.includes(caso.campoError),
            `Se esperaba error en campo "${caso.campoError}", pero se obtuvo: ${JSON.stringify(caminosDeError)}`
          );
        }
      });
    }
  });

  describe('Otros esquemas clave del contrato (seguridad e integridad)', () => {
    it('registrarUsuarioSchema rechaza campos adicionales como rol y activo', () => {
      const res = registrarUsuarioSchema.safeParse({
        nombre: 'Artesano Test',
        email: 'test@poncho.gob.ar',
        password: 'Password1234#',
        rol: 'ADMINISTRADOR',
        activo: false
      });
      assert.strictEqual(res.success, false);
    });

    it('postulacionSchema rechaza campos adicionales como estado y rol', () => {
      const res = postulacionSchema.safeParse({
        nombre: 'Carlos',
        email: 'carlos@test.com',
        password: 'Password1234#',
        estado: 'APROBADO',
        rol: 'ADMINISTRADOR'
      });
      assert.strictEqual(res.success, false);
    });

    it('resolverSolicitudSchema solo permite APROBADA o RECHAZADA', () => {
      assert.strictEqual(resolverSolicitudSchema.safeParse({ estado: 'APROBADA' }).success, true);
      assert.strictEqual(resolverSolicitudSchema.safeParse({ estado: 'RECHAZADA' }).success, true);
      assert.strictEqual(resolverSolicitudSchema.safeParse({ estado: 'PENDIENTE' }).success, false);
      assert.strictEqual(resolverSolicitudSchema.safeParse({ estado: 'OTRO' }).success, false);
    });
  });
});
