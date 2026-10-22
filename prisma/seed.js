import bcrypt from 'bcryptjs';
import { prisma } from '../src/config/db.js';

async function main() {
  console.log('Iniciando carga de datos...');

  const passwordAdminHash = await bcrypt.hash('Admin1234#', 10);
  const passwordArtesanoHash = await bcrypt.hash('Artesano1234#', 10);

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
  console.log('Admin creado:', admin.email);

  const localidad = await prisma.localidad.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nombre: 'San Fernando del Valle de Catamarca',
      provincia: 'Catamarca'
    }
  });

  const ubicacion = await prisma.ubicacion.upsert({
    where: { id: 1 },
    update: {},
    create: {
      pabellon: 'Pabellón Artesanías Tradicionales',
      sector: 'Sector A'
    }
  });

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
  console.log('Artesano creado:', usuarioArtesano.email);

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

  console.log('Carga de datos completada.');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
