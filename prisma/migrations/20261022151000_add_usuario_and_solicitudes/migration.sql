-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMINISTRADOR', 'ARTESANO', 'POSTULANTE');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA');

-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT IF EXISTS "Producto_artesanoId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "Artesano_email_key";

-- AlterTable
ALTER TABLE "Artesano" DROP COLUMN IF EXISTS "activo",
DROP COLUMN IF EXISTS "email",
DROP COLUMN IF EXISTS "passwordHash",
DROP COLUMN IF EXISTS "ultimoAcceso",
ADD COLUMN IF NOT EXISTS "usuarioId" UUID;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Usuario" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'ARTESANO',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimoAcceso" TIMESTAMP(3),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Solicitud" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'PENDIENTE',
    "motivo" TEXT,
    "usuarioId" UUID NOT NULL,
    "artesanoId" UUID,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Artesano_usuarioId_key" ON "Artesano"("usuarioId");

-- AddForeignKey
ALTER TABLE "Artesano" DROP CONSTRAINT IF EXISTS "Artesano_usuarioId_fkey";
ALTER TABLE "Artesano" ADD CONSTRAINT "Artesano_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT IF EXISTS "Solicitud_usuarioId_fkey";
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT IF EXISTS "Solicitud_artesanoId_fkey";
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_artesanoId_fkey" FOREIGN KEY ("artesanoId") REFERENCES "Artesano"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT IF EXISTS "Producto_artesanoId_fkey";
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_artesanoId_fkey" FOREIGN KEY ("artesanoId") REFERENCES "Artesano"("id") ON DELETE CASCADE ON UPDATE CASCADE;
