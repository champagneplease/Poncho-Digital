-- CreateTable
CREATE TABLE "Stand" (
    "id" SERIAL NOT NULL,
    "pabellon" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'disponible',
    "coordenadas" TEXT NOT NULL,
    "artesanoId" INTEGER,

    CONSTRAINT "Stand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stand_artesanoId_key" ON "Stand"("artesanoId");

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_artesanoId_fkey" FOREIGN KEY ("artesanoId") REFERENCES "Artesano"("id") ON DELETE SET NULL ON UPDATE CASCADE;
