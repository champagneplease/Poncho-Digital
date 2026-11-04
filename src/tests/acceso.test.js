import { describe, it, beforeEach, after } from 'node:test';
import assert from 'node:assert';

// 2.4 Aserciones de seguridad antes de importar la app
assert.strictEqual(process.env.NODE_ENV, 'test', 'NODE_ENV debe ser "test"');
assert.ok(
  process.env.DATABASE_URL && process.env.DATABASE_URL.includes('_test'),
  'DATABASE_URL debe apuntar a una base de datos de pruebas (*_test)'
);

// Importación dinámica tras las aserciones de entorno
const { default: app } = await import('../app.js');
const { prisma, desconectarDb } = await import('../config/db.js');
const { default: request } = await import('supertest');
const { generarToken } = await import('../services/tokens-services.js');
const { default: bcrypt } = await import('bcryptjs');

describe('2.2 Pruebas de acceso sobre endpoints protegidos', () => {
  beforeEach(async () => {
    // 2.4 Limpieza en beforeEach en estricto orden de dependencias
    await prisma.tokenRevocado.deleteMany();
    await prisma.producto.deleteMany();
    await prisma.stand.deleteMany();
    await prisma.solicitud.deleteMany();
    await prisma.artesano.deleteMany();
    await prisma.ubicacion.deleteMany();
    await prisma.localidad.deleteMany();
    await prisma.usuario.deleteMany();
  });

  after(async () => {
    // 2.4 Desconexión al finalizar
    await desconectarDb();
  });

  it('1. Sin token -> Responde 401 y comprueba estado y cuerpo', async () => {
    const res = await request(app)
      .post('/productos')
      .send({ nombre: 'Vasija de Barro', precio: 5000 });

    assert.strictEqual(res.status, 401, 'Debe responder con código 401');
    assert.ok(res.body && typeof res.body === 'object', 'El cuerpo debe ser un objeto JSON');
    assert.strictEqual(
      res.body.mensaje,
      'Se requiere un token de acceso.',
      'El mensaje en el cuerpo debe indicar que se requiere un token de acceso'
    );
  });

  it('2. Authorization mal formada -> Responde 400 y comprueba estado y cuerpo', async () => {
    const cabecerasInvalidas = [
      'Basic usuario:password',
      'Bearer',
      'Token eyJhbGciOi...',
      'BearerConPrefijoPegado'
    ];

    for (const authHeader of cabecerasInvalidas) {
      const res = await request(app)
        .post('/productos')
        .set('Authorization', authHeader)
        .send({ nombre: 'Vasija de Barro', precio: 5000 });

      assert.strictEqual(res.status, 400, `Debe responder con código 400 para cabecera "${authHeader}"`);
      assert.ok(res.body && typeof res.body === 'object', 'El cuerpo debe ser un objeto JSON');
      assert.strictEqual(
        res.body.mensaje,
        'Usar Authorization: Bearer <token>.',
        'El mensaje en el cuerpo debe indicar el formato Bearer esperado'
      );
    }
  });

  it('3. Token inválido -> Responde 401 y comprueba estado y cuerpo', async () => {
    const res = await request(app)
      .post('/productos')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tokenInvalidoFalso.firmaInvalida')
      .send({ nombre: 'Vasija de Barro', precio: 5000 });

    assert.strictEqual(res.status, 401, 'Debe responder con código 401 para token inválido');
    assert.ok(res.body && typeof res.body === 'object', 'El cuerpo debe ser un objeto JSON');
    assert.strictEqual(
      res.body.mensaje,
      'Token inválido, vencido o revocado.',
      'El mensaje en el cuerpo debe indicar que el token es inválido o vencido'
    );
  });

  it('4. Rol que no corresponde -> Responde 403 y comprueba estado y cuerpo', async () => {
    // Creamos un usuario con rol ADMINISTRADOR
    const passwordHash = await bcrypt.hash('Password123#', 10);
    const adminUser = await prisma.usuario.create({
      data: {
        nombre: 'Admin Pruebas',
        email: 'admin_test@poncho.gob.ar',
        passwordHash,
        rol: 'ADMINISTRADOR',
        activo: true
      }
    });

    const tokenAdmin = generarToken({
      id: adminUser.id,
      email: adminUser.email,
      rol: adminUser.rol
    });

    // El admin intenta acceder a POST /productos que requiere rol ARTESANO
    const res = await request(app)
      .post('/productos')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ nombre: 'Vasija Ilegal', precio: 5000 });

    assert.strictEqual(res.status, 403, 'Debe responder con código 403 para un rol no autorizado');
    assert.ok(res.body && typeof res.body === 'object', 'El cuerpo debe ser un objeto JSON');
    assert.ok(
      res.body.mensaje && res.body.mensaje.includes('Acceso prohibido'),
      `El mensaje de error debe indicar acceso prohibido. Obtenido: "${res.body.mensaje}"`
    );
    assert.ok(
      res.body.mensaje.includes('ARTESANO'),
      `El mensaje debe detallar el rol requerido (ARTESANO). Obtenido: "${res.body.mensaje}"`
    );
  });
});
