/*
  Warnings:

  - Added the required column `updatedAt` to the `Artesano` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Localidad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Stand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ubicacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artesano" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Localidad" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Stand" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Ubicacion" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
