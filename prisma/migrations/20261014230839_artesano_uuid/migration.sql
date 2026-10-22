/*
  Warnings:

  - The primary key for the `Artesano` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `artesanoId` column on the `Producto` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `artesanoId` column on the `Stand` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `id` on the `Artesano` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_artesanoId_fkey";

-- DropForeignKey
ALTER TABLE "Stand" DROP CONSTRAINT "Stand_artesanoId_fkey";

-- AlterTable
ALTER TABLE "Artesano" DROP CONSTRAINT "Artesano_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "apellido" DROP NOT NULL,
ADD CONSTRAINT "Artesano_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "artesanoId",
ADD COLUMN     "artesanoId" UUID;

-- AlterTable
ALTER TABLE "Stand" DROP COLUMN "artesanoId",
ADD COLUMN     "artesanoId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Stand_artesanoId_key" ON "Stand"("artesanoId");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_artesanoId_fkey" FOREIGN KEY ("artesanoId") REFERENCES "Artesano"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_artesanoId_fkey" FOREIGN KEY ("artesanoId") REFERENCES "Artesano"("id") ON DELETE SET NULL ON UPDATE CASCADE;
