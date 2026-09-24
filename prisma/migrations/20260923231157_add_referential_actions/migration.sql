-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_artesanoId_fkey";

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_artesanoId_fkey" FOREIGN KEY ("artesanoId") REFERENCES "Artesano"("id") ON DELETE CASCADE ON UPDATE CASCADE;
