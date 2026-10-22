import app from '../app.js';

async function runTests() {
  const server = app.listen(3002);
  const baseUrl = 'http://localhost:3002';
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    console.log('Ejecutando pruebas de integración...\n');

    const loginAdminRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@poncho.gob.ar', password: 'Admin1234#' })
    });
    const loginAdminData = await loginAdminRes.json();
    assert(loginAdminRes.status === 200 && loginAdminData.token, 'Login de administrador correcto');
    assert(!loginAdminData.usuario.passwordHash, 'Respuesta de login no expone passwordHash');
    const adminToken = loginAdminData.token;

    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.email === 'admin@poncho.gob.ar', 'GET /auth/me devuelve datos de la cuenta');

    const loginArtesanoRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'artesano@poncho.gob.ar', password: 'Artesano1234#' })
    });
    const loginArtesanoData = await loginArtesanoRes.json();
    assert(loginArtesanoRes.status === 200 && loginArtesanoData.usuario.rol === 'ARTESANO', 'Login de artesano correcto');
    const artesanoToken = loginArtesanoData.token;

    const misProdRes = await fetch(`${baseUrl}/productos/mis-productos`, {
      headers: { Authorization: `Bearer ${artesanoToken}` }
    });
    const misProdData = await misProdRes.json();
    assert(misProdRes.status === 200 && Array.isArray(misProdData), 'GET /productos/mis-productos retorna array');

    const createProdRes = await fetch(`${baseUrl}/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${artesanoToken}`
      },
      body: JSON.stringify({ nombre: 'Vasija de Barro Calchaquí', precio: 45000 })
    });
    const createProdData = await createProdRes.json();
    assert(createProdRes.status === 201 && createProdData.id, 'Creación de producto exitosa');

    const adminCreateProdRes = await fetch(`${baseUrl}/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ nombre: 'Intento Ilegal', precio: 1000 })
    });
    assert(adminCreateProdRes.status === 403, 'Usuario administrador no puede crear productos (403)');

    const artesanoCreateStandRes = await fetch(`${baseUrl}/stands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${artesanoToken}`
      },
      body: JSON.stringify({ ubicacionId: 1 })
    });
    assert(artesanoCreateStandRes.status === 403, 'Usuario artesano no puede crear stands (403)');

    const updateFakeRes = await fetch(`${baseUrl}/productos/999999`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${artesanoToken}`
      },
      body: JSON.stringify({ nombre: 'Inexistente', precio: 5000 })
    });
    const updateFakeData = await updateFakeRes.json();
    assert(updateFakeRes.status === 404 && updateFakeData.mensaje === 'Producto no encontrado.', 'Modificar producto inexistente retorna 404');

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
        motivo: 'Tejeduría tradicional'
      })
    });
    const postulaData = await postulaRes.json();
    assert(postulaRes.status === 201 && postulaData.solicitud?.estado === 'PENDIENTE', 'Postulación registrada con estado PENDIENTE');
    const solicitudId = postulaData.solicitud.id;

    const listSolRes = await fetch(`${baseUrl}/solicitudes`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const listSolData = await listSolRes.json();
    assert(listSolRes.status === 200 && listSolData.length > 0, 'Listado de solicitudes');

    const resolverRes = await fetch(`${baseUrl}/solicitudes/${solicitudId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ estado: 'APROBADA', motivo: 'Documentación verificada' })
    });
    assert(resolverRes.status === 200, 'Aprobación de solicitud');

    const resolverAgainRes = await fetch(`${baseUrl}/solicitudes/${solicitudId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ estado: 'RECHAZADA' })
    });
    assert(resolverAgainRes.status === 409, 'Resolver solicitud ya resuelta responde 409');

    const logoutRes = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${artesanoToken}` }
    });
    assert(logoutRes.status === 204, 'POST /auth/logout responde 204');

    const testRevocadoRes = await fetch(`${baseUrl}/productos/mis-productos`, {
      headers: { Authorization: `Bearer ${artesanoToken}` }
    });
    assert(testRevocadoRes.status === 401, 'Token revocado responde 401');

    console.log(`\nPruebas finalizadas: ${passed} correctas, ${failed} fallidas.`);
  } catch (err) {
    console.error('Error durante la ejecución:', err);
  } finally {
    server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
