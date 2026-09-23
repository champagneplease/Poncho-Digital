-- CreateTable
CREATE TABLE "Artesano" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "localidad" TEXT NOT NULL,

    CONSTRAINT "Artesano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "artesanoId" INTEGER NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_artesanoId_fkey" FOREIGN KEY ("artesanoId") REFERENCES "Artesano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
