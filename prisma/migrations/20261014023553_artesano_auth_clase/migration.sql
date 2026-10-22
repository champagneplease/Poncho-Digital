/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Artesano` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Artesano` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Artesano` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artesano" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "ultimoAcceso" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "TokenRevocado" (
    "jti" TEXT NOT NULL,
    "venceEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenRevocado_pkey" PRIMARY KEY ("jti")
);

-- CreateIndex
CREATE INDEX "TokenRevocado_venceEn_idx" ON "TokenRevocado"("venceEn");

-- CreateIndex
CREATE UNIQUE INDEX "Artesano_email_key" ON "Artesano"("email");
