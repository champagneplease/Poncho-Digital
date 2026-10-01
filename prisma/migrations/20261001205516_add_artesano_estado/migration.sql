-- AlterTable
ALTER TABLE "Artesano" ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE "Stand" ADD COLUMN     "coordenadas" TEXT;
