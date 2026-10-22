-- DropForeignKey
ALTER TABLE "Artesano" DROP CONSTRAINT "Artesano_localidadId_fkey";

-- AlterTable
ALTER TABLE "Artesano" ALTER COLUMN "localidadId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Artesano" ADD CONSTRAINT "Artesano_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
