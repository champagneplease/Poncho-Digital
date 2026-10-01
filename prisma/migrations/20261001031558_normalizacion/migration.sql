/*
  Warnings:

  - You are about to drop the column `localidad` on the `Artesano` table. All the data in the column will be lost.
  - You are about to drop the column `pabellon` on the `Stand` table. All the data in the column will be lost.
  - You are about to drop the column `sector` on the `Stand` table. All the data in the column will be lost.
  - Added the required column `apellido` to the `Artesano` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localidadId` to the `Artesano` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ubicacionId` to the `Stand` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artesano" DROP COLUMN "localidad",
ADD COLUMN     "apellido" TEXT NOT NULL,
ADD COLUMN     "localidadId" INTEGER NOT NULL,
ADD COLUMN     "telefono" TEXT;

-- AlterTable
ALTER TABLE "Stand" DROP COLUMN "pabellon",
DROP COLUMN "sector",
ADD COLUMN     "ubicacionId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Localidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "provincia" TEXT,

    CONSTRAINT "Localidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ubicacion" (
    "id" SERIAL NOT NULL,
    "pabellon" TEXT NOT NULL,
    "sector" TEXT NOT NULL,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Artesano" ADD CONSTRAINT "Artesano_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
