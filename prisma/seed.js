import bcrypt from 'bcryptjs';
import { prisma } from '../src/config/db.js';

async function main() {
  console.log('🌱 Iniciando carga de datos iniciales (Seed)...');

  const passwordAdminHash = await bcrypt.hash('Admin1234#', 10);
  const passwordArtesanoHash = await bcrypt.hash('Artesano1234#', 10);

  // 1. Crear Administrador inicial
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@poncho.gob.ar' },
    update: {},
    create: {
      nombre: 'Administrador Poncho',
      email: 'admin@poncho.gob.ar',
      passwordHash: passwordAdminHash,
      rol: 'ADMINISTRADOR',
      activo: true
    }
  });
  console.log('✅ Administrador creado:', admin.email);

  // 2. Crear Localidad
  const localidad = await prisma.localidad.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nombre: 'San Fernando del Valle de Catamarca',
      provincia: 'Catamarca'
    }
  });

  // 3. Crear Ubicación
  const ubicacion = await prisma.ubicacion.upsert({
    where: { id: 1 },
    update: {},
    create: {
      pabellon: 'Pabellón Artesanías Tradicionales',
      sector: 'Sector A'
    }
  });

  // 4. Crear Usuario Artesano con perfil vinculado
  const usuarioArtesano = await prisma.usuario.upsert({
    where: { email: 'artesano@poncho.gob.ar' },
    update: {},
    create: {
      nombre: 'Juan Poncho',
      email: 'artesano@poncho.gob.ar',
      passwordHash: passwordArtesanoHash,
      rol: 'ARTESANO',
      activo: true
    }
  });

  const artesano = await prisma.artesano.upsert({
    where: { usuarioId: usuarioArtesano.id },
    update: {},
    create: {
      nombre: 'Juan',
      apellido: 'Poncho',
      telefono: '+54 383 4123456',
      estado: 'APROBADO',
      usuarioId: usuarioArtesano.id,
      localidadId: localidad.id
    }
  });
  console.log('✅ Artesano creado:', usuarioArtesano.email);

  // 5. Crear Stand
  await prisma.stand.upsert({
    where: { id: 1 },
    update: { artesanoId: artesano.id, estado: 'ocupado' },
    create: {
      ubicacionId: ubicacion.id,
      artesanoId: artesano.id,
      estado: 'ocupado',
      coordenadas: '-28.4689,-65.7795'
    }
  });

  // 6. Crear Producto de prueba
  const productoExistente = await prisma.producto.findFirst({
    where: { artesanoId: artesano.id, nombre: 'Poncho de Vicuña Catamarqueño' }
  });

  if (!productoExistente) {
    await prisma.producto.create({
      data: {
        nombre: 'Poncho de Vicuña Catamarqueño',
        precio: 850000,
        artesanoId: artesano.id
      }
    });
  }

  console.log('🎉 Seed completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
