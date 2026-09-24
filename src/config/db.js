import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno

// Creamos el "Pool" de conexiones nativo de PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Le pasamos ese pool al adaptador de Prisma
const adapter = new PrismaPg(pool);

// Inicializamos Prisma usando el adaptador
const prisma = new PrismaClient({ adapter });

export default prisma;