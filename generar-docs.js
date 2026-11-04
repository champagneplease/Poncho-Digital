import swaggerAutogen from 'swagger-autogen';
import fs from 'fs';
import { esquemas } from './src/documentacion/esquemas.js';

const doc = {
  openapi: '3.0.0',
  info: {
    title: 'Poncho Digital API',
    description: 'Documentación oficial de la API de Poncho Digital. Gestión de artesanos, productos, stands y postulaciones para la Fiesta Nacional e Internacional del Poncho.',
    version: '1.0.0'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local de desarrollo'
    }
  ],
  components: {
    '@schemas': esquemas,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese el token JWT obtenido tras autenticarse en POST /auth/login. En Swagger UI, pegue únicamente el valor del token.'
      }
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./src/app.js'];

await swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);

// Normalizar paths para remover trailing slashes estéticos (/productos/ -> /productos)
if (fs.existsSync(outputFile)) {
  const generated = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
  const cleanPaths = {};
  for (const [p, val] of Object.entries(generated.paths || {})) {
    const cleanPath = p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
    cleanPaths[cleanPath] = val;
  }
  generated.paths = cleanPaths;
  fs.writeFileSync(outputFile, JSON.stringify(generated, null, 2), 'utf8');
}

console.log(`Documentación Swagger OpenAPI 3.0 generada con éxito en ${outputFile}`);
