import cron from 'node-cron';
import { eliminarTokensVencidos } from '../services/revocaciones-services.js';

export const iniciarCronTokens = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const cantidad = await eliminarTokensVencidos();
      if (cantidad > 0) {
        console.log(`[cron] Tokens revocados eliminados: ${cantidad}`);
      }
    } catch (error) {
      console.error('[cron] Error al limpiar tokens revocados:', error);
    }
  });
};
