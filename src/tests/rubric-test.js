import app from '../app.js';

async function runTests() {
  const server = app.listen(3002);
  const baseUrl = 'http://localhost:3002';
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ ${message}`);
      passed++;
    } else {
      console.error(`❌ FAILED: ${message}`);
      failed++;
    }
  }

  try {
    console.log('🚀 Iniciando suite de pruebas de rúbrica...\n');

    // 1. Login Admin
    const loginAdminRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@poncho.gob.ar', password: 'Admin1234#' })
    });
    const loginAdminData = await loginAdminRes.json();
    assert(loginAdminRes.status === 200 && loginAdminData.token, '1. Login de Administrador retorna 200 y token');
    assert(!loginAdminData.usuario.passwordHash, '1.4 Respuesta de login no expone passwordHash');
    const adminToken = loginAdminData.token;

    // 2. GET /auth/me (Criterio 2.5)
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.email === 'admin@poncho.gob.ar', '2.5 GET /auth/me devuelve datos de la cuenta');

    // 3. Login Artesano
    const loginArtesanoRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'artesano@poncho.gob.ar', password: 'Artesano1234#' })
    });
    const loginArtesanoData = await loginArtesanoRes.json();
    assert(loginArtesanoRes.status === 200 && loginArtesanoData.usuario.rol === 'ARTESANO', '3. Login de Artesano retorna rol ARTESANO');
    const artesanoToken = loginArtesanoData.token;

    // 4. GET /productos/mis-productos (Criterio 5)
    const misProdRes = await fetch(`${baseUrl}/productos/mis-productos`, {
      headers: { Authorization: `Bearer ${artesanoToken}` }
    });
    const misProdData = await misProdRes.json();
    assert(misProdRes.status === 200 && Array.isArray(misProdData), '5. GET /productos/mis-productos retorna listado propio');

    // 5. POST /productos (Criterio 4 & 5)
    const createProdRes = await fetch(`${baseUrl}/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${artesanoToken}`
      },
      body: JSON.stringify({ nombre: 'Vasija de Barro Calchaquí', precio: 45000 })
    });
    const createProdData = await createProdRes.json();
    assert(createProdRes.status === 201 && createProdData.id, '5. Alta de producto exitosa vinculada a artesano');
    const nuevoProductoId = createProdData.id;

    // 6. Admin intenta crear producto (debe fallar con 403: solo ARTESANO)
    const adminCreateProdRes = await fetch(`${baseUrl}/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ nombre: 'Intento Ilegal', precio: 1000 })
    });
    assert(adminCreateProdRes.status === 403, '4. Solo ARTESANO puede crear productos (Admin recibe 403)');

    // 7. Artesano intenta crear stand (debe fallar con 403: solo ADMIN)
    const artesanoCreateStandRes = await fetch(`${baseUrl}/stands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${artesanoToken}`
      },
      body: JSON.stringify({ ubicacionId: 1 })
    });
    assert(artesanoCreateStandRes.status === 403, '4. Solo ADMINISTRADOR puede crear stands (Artesano recibe 403)');

    // 8. Modificar producto ajeno o inexistente -> 404 (Criterio 5)
    const updateFakeRes = await fetch(`${baseUrl}/productos/999999`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${artesanoToken}`
      },
      body: JSON.stringify({ nombre: 'Inexistente', precio: 5000 })
    });
    const updateFakeData = await updateFakeRes.json();
    assert(updateFakeRes.status === 404 && updateFakeData.mensaje === 'Producto no encontrado.', '5. Modificar producto inexistente/ajeno retorna 404 con mensaje unificado');

    // 9. Postulación pública (Criterio 6)
    const postulaEmail = `postulante_${Date.now()}@test.com`;
    const postulaRes = await fetch(`${baseUrl}/auth/postulacion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Carlos',
        apellido: 'Tejedor',
        email: postulaEmail,
        password: 'Password1234#',
        telefono: '+54 383 499999',
        motivo: 'Tejeduría tradicional en telar criollo'
      })
    });
    const postulaData = await postulaRes.json();
    assert(postulaRes.status === 201 && postulaData.solicitud?.estado === 'PENDIENTE', '6. Postulación pública crea Usuario + Artesano + Solicitud PENDIENTE');
    const solicitudId = postulaData.solicitud.id;

    // 10. Listar solicitudes (Admin)
    const listSolRes = await fetch(`${baseUrl}/solicitudes`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const listSolData = await listSolRes.json();
    assert(listSolRes.status === 200 && listSolData.length > 0, '6. Admin lista solicitudes pendientes');

    // 11. Resolver solicitud: APROBADA (Criterio 6)
    const resolverRes = await fetch(`${baseUrl}/solicitudes/${solicitudId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ estado: 'APROBADA', motivo: 'Documentación verificada' })
    });
    assert(resolverRes.status === 200, '6. Admin aprueba solicitud y habilita al artesano');

    // 12. Resolver solicitud ya resuelta -> 409 (Criterio 6)
    const resolverAgainRes = await fetch(`${baseUrl}/solicitudes/${solicitudId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ estado: 'RECHAZADA' })
    });
    assert(resolverAgainRes.status === 409, '6. Resolver solicitud ya resuelta responde 409 Conflicto');

    // 13. Logout (Criterio 2.6)
    const logoutRes = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${artesanoToken}` }
    });
    assert(logoutRes.status === 204, '2.6 POST /auth/logout responde 204');

    // 14. Token revocado ahora responde 401
    const testRevocadoRes = await fetch(`${baseUrl}/productos/mis-productos`, {
      headers: { Authorization: `Bearer ${artesanoToken}` }
    });
    assert(testRevocadoRes.status === 401, '2.6 Token revocado devuelve 401');

    console.log(`\n🏁 Resultado: ${passed} exitosas, ${failed} fallidas.`);
  } catch (err) {
    console.error('Error durante la ejecución de pruebas:', err);
  } finally {
    server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
