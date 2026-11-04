import { describe, it, beforeEach, after } from 'node:test';
import assert from 'node:assert';

// 2.4 Aserciones de seguridad antes de importar app
assert.strictEqual(process.env.NODE_ENV, 'test', 'NODE_ENV debe ser "test"');
assert.ok(
  process.env.DATABASE_URL && process.env.DATABASE_URL.includes('_test'),
  'DATABASE_URL debe apuntar a una base de datos de pruebas (*_test)'
);

// Importación dinámica tras las aserciones de entorno
const { default: app } = await import('../app.js');
const { prisma, desconectarDb } = await import('../config/db.js');
const { default: request } = await import('supertest');
const { default: bcrypt } = await import('bcryptjs');
const { generarToken } = await import('../services/tokens-services.js');

describe('2.5 Pruebas de Integración - Persistencia, propiedad y ciclo de vida', () => {
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

  // Helper para crear un artesano completo con usuario y token
  async function crearArtesanoTest({ email, nombre, apellido }) {
    const passwordHash = await bcrypt.hash('Password123#', 10);
    const usuario = await prisma.usuario.create({
      data: {
        nombre: `${nombre} ${apellido}`,
        email,
        passwordHash,
        rol: 'ARTESANO',
        activo: true
      }
    });

    const artesano = await prisma.artesano.create({
      data: {
        nombre,
        apellido,
        estado: 'APROBADO',
        usuarioId: usuario.id
      }
    });

    const token = generarToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    });

    return { usuario, artesano, token };
  }

  // Helper para crear un administrador completo con token
  async function crearAdminTest(email = 'admin@poncho.gob.ar') {
    const passwordHash = await bcrypt.hash('Admin1234#', 10);
    const admin = await prisma.usuario.create({
      data: {
        nombre: 'Admin Central',
        email,
        passwordHash,
        rol: 'ADMINISTRADOR',
        activo: true
      }
    });

    const token = generarToken({
      id: admin.id,
      email: admin.email,
      rol: admin.rol
    });

    return { admin, token };
  }

  describe('Persistencia y Control de Propiedad (IDOR)', () => {
    it('Alta correcta verificada en la base de datos (pertenece a la cuenta autenticada)', async () => {
      const artesanoA = await crearArtesanoTest({
        email: 'artesano_a@poncho.gob.ar',
        nombre: 'Rosa',
        apellido: 'Calchaquí'
      });

      const res = await request(app)
        .post('/productos')
        .set('Authorization', `Bearer ${artesanoA.token}`)
        .send({
          nombre: 'Poncho de Vicuña Tradicional',
          precio: 850000
        });

      assert.strictEqual(res.status, 201, 'El alta de producto debe responder 201 Created');
      assert.ok(res.body.id, 'La respuesta debe incluir el ID generado');
      assert.strictEqual(res.body.nombre, 'Poncho de Vicuña Tradicional');
      assert.strictEqual(res.body.precio, 850000);
      assert.strictEqual(
        res.body.artesanoId,
        artesanoA.artesano.id,
        'El artesanoId retornado debe coincidir con el artesano autenticado'
      );

      // Verificación directa en base de datos
      const productoEnDb = await prisma.producto.findUnique({
        where: { id: res.body.id }
      });

      assert.ok(productoEnDb, 'El producto debe encontrarse persistido en la base de datos');
      assert.strictEqual(productoEnDb.nombre, 'Poncho de Vicuña Tradicional');
      assert.strictEqual(productoEnDb.precio, 850000);
      assert.strictEqual(
        productoEnDb.artesanoId,
        artesanoA.artesano.id,
        'El producto en la base de datos debe pertenecer a la cuenta autenticada'
      );
    });

    it('Acceso a un recurso ajeno -> 404 comprobando que el registro sigue existiendo y no cambió de dueño', async () => {
      // 1. Crear Artesano A y dar de alta su producto
      const artesanoA = await crearArtesanoTest({
        email: 'artesano_legitimo@poncho.gob.ar',
        nombre: 'Carlos',
        apellido: 'Tejedor'
      });

      const productoOriginal = await prisma.producto.create({
        data: {
          nombre: 'Manta de Lana de Llama',
          precio: 120000,
          artesanoId: artesanoA.artesano.id
        }
      });

      // 2. Crear Artesano B (atacante que intentará modificar o borrar el producto de A)
      const artesanoB = await crearArtesanoTest({
        email: 'artesano_ajeno@poncho.gob.ar',
        nombre: 'Intruso',
        apellido: 'Malicioso'
      });

      // 3. Intento de modificación sobre recurso ajeno
      const resPut = await request(app)
        .put(`/productos/${productoOriginal.id}`)
        .set('Authorization', `Bearer ${artesanoB.token}`)
        .send({
          nombre: 'Producto Hackeado',
          precio: 1
        });

      assert.strictEqual(
        resPut.status,
        404,
        'Modificar un producto ajeno debe responder 404 (IDOR protegido)'
      );
      assert.strictEqual(resPut.body.mensaje, 'Producto no encontrado.');

      // 4. Comprobación en base de datos: el registro sigue existiendo y no cambió de dueño
      const productoPostPut = await prisma.producto.findUnique({
        where: { id: productoOriginal.id }
      });

      assert.ok(productoPostPut, 'El registro sigue existiendo en la base de datos');
      assert.strictEqual(
        productoPostPut.artesanoId,
        artesanoA.artesano.id,
        'El registro no cambió de dueño (sigue perteneciendo a Artesano A)'
      );
      assert.strictEqual(
        productoPostPut.nombre,
        'Manta de Lana de Llama',
        'El nombre del producto no fue alterado'
      );
      assert.strictEqual(
        productoPostPut.precio,
        120000,
        'El precio del producto no fue alterado'
      );

      // 5. Intento de eliminación sobre recurso ajeno
      const resDelete = await request(app)
        .delete(`/productos/${productoOriginal.id}`)
        .set('Authorization', `Bearer ${artesanoB.token}`);

      assert.strictEqual(
        resDelete.status,
        404,
        'Eliminar un producto ajeno debe responder 404 (IDOR protegido)'
      );

      // 6. Comprobación en base de datos: el registro sigue intacto
      const productoPostDelete = await prisma.producto.findUnique({
        where: { id: productoOriginal.id }
      });

      assert.ok(productoPostDelete, 'El registro continúa existiendo tras intento de borrado ajeno');
      assert.strictEqual(productoPostDelete.artesanoId, artesanoA.artesano.id);
    });
  });

  describe('Flujos de Autenticación, Postulación y Solicitudes', () => {
    it('Flujo completo de sesión: Login -> Me -> Logout -> Token revocado responde 401', async () => {
      const { usuario, token } = await crearArtesanoTest({
        email: 'sesion_test@poncho.gob.ar',
        nombre: 'Juana',
        apellido: 'Manuela'
      });

      // GET /auth/me con token válido
      const meRes = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);
      assert.strictEqual(meRes.status, 200);
      assert.strictEqual(meRes.body.email, usuario.email);

      // POST /auth/logout
      const logoutRes = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`);
      assert.strictEqual(logoutRes.status, 204);

      // Verificar que el token revocado ahora responde 401
      const accesoRevocadoRes = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);
      assert.strictEqual(accesoRevocadoRes.status, 401);
      assert.strictEqual(accesoRevocadoRes.body.mensaje, 'Token inválido, vencido o revocado.');
    });

    it('Flujo de postulación y resolución administrativa de solicitudes', async () => {
      const { token: adminToken } = await crearAdminTest('admin_solicitudes@poncho.gob.ar');

      // 1. Postulación pública
      const postulaRes = await request(app)
        .post('/auth/postulacion')
        .send({
          nombre: 'María',
          apellido: 'Orfebre',
          email: 'maria_orfebre@test.com',
          password: 'Password1234#',
          telefono: '+54 383 4991122',
          motivo: 'Platería criolla tradicional'
        });

      assert.strictEqual(postulaRes.status, 201);
      assert.strictEqual(postulaRes.body.solicitud?.estado, 'PENDIENTE');
      const solicitudId = postulaRes.body.solicitud.id;

      // 2. Administrador lista las solicitudes
      const listRes = await request(app)
        .get('/solicitudes')
        .set('Authorization', `Bearer ${adminToken}`);
      assert.strictEqual(listRes.status, 200);
      assert.ok(Array.isArray(listRes.body));
      assert.ok(listRes.body.some((s) => s.id === solicitudId));

      // 3. Administrador aprueba la solicitud
      const resolverRes = await request(app)
        .patch(`/solicitudes/${solicitudId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ estado: 'APROBADA', motivo: 'Documentación y antecedentes validados' });

      assert.strictEqual(resolverRes.status, 200);
      assert.strictEqual(resolverRes.body.solicitud?.estado, 'APROBADA');

      // Verificar que el usuario ascendió a ARTESANO y el artesano está APROBADO
      const usuarioEnDb = await prisma.usuario.findUnique({
        where: { email: 'maria_orfebre@test.com' },
        include: { artesano: true }
      });
      assert.strictEqual(usuarioEnDb.rol, 'ARTESANO');
      assert.strictEqual(usuarioEnDb.artesano?.estado, 'APROBADO');

      // 4. Intentar resolver de nuevo una solicitud ya resuelta responde 409
      const reResolverRes = await request(app)
        .patch(`/solicitudes/${solicitudId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ estado: 'RECHAZADA' });

      assert.strictEqual(reResolverRes.status, 409);
      assert.strictEqual(reResolverRes.body.mensaje, 'La solicitud ya fue resuelta.');
    });
  });
});

