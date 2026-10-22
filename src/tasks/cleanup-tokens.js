import cron from 'node-cron';
import { eliminarTokensVencidos } from '../services/revocaciones-services.js';

export const iniciarCronTokens = () => {
  // Ejecuta diariamente a la medianoche (00:00)
  cron.schedule('0 0 * * *', async () => {
    try {
      const cantidad = await eliminarTokensVencidos();
      if (cantidad > 0) {
        console.log(`🧹 [CRON] Tokens revocados expirados eliminados: ${cantidad}`);
      }
    } catch (error) {
      console.error('❌ [CRON] Error al limpiar tokens revocados expirados:', error);
    }
  });
};
