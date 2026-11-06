# Poncho Digital - API REST

API REST desarrollada para la plataforma web "Poncho Digital", destinada a gestionar y brindar información sobre artesanos, productos y stands de la Feria de la Fiesta Nacional e Internacional del Poncho.

Este proyecto corresponde al Trabajo de Laboratorio integrador de la cátedra **Desarrollo Backend** de la Tecnicatura Universitaria en Diseño de Software de la Facultad de Tecnología y Ciencias Aplicadas (U.N.Ca.).

La API utiliza Express para exponer los endpoints, Prisma ORM para acceder a PostgreSQL, Zod para validar los datos recibidos, JSON Web Tokens para la autenticación y Swagger (OpenAPI 3.0) para documentar el contrato.

## Integrantes del equipo

- Benjamín Jeremías Cano
- Miranda Juan Ignacio

## Índice

1. [Funcionalidades implementadas](#funcionalidades-implementadas)
2. [Tecnologías utilizadas](#tecnologías-utilizadas)
3. [Requisitos previos](#requisitos-previos)
4. [Obtener el proyecto](#obtener-el-proyecto)
5. [Instalar las dependencias](#instalar-las-dependencias)
6. [Archivos del repositorio](#archivos-del-repositorio)
7. [Preparar PostgreSQL](#preparar-postgresql)
8. [Configurar las variables de entorno](#configurar-las-variables-de-entorno)
9. [Preparar Prisma y la base de datos](#preparar-prisma-y-la-base-de-datos)
10. [Datos iniciales (seed)](#datos-iniciales-seed)
11. [Ejecutar la API](#ejecutar-la-api)
12. [Instalación rápida](#instalación-rápida)
13. [Scripts disponibles](#scripts-disponibles)
14. [Documentación interactiva (Swagger)](#documentación-interactiva-swagger)
15. [Autenticación y autorización](#autenticación-y-autorización)
16. [Endpoints disponibles](#endpoints-disponibles)
17. [Cuerpos JSON de las solicitudes](#cuerpos-json-de-las-solicitudes)
18. [Reglas de negocio](#reglas-de-negocio)
19. [Respuestas de error y códigos HTTP](#respuestas-de-error-y-códigos-http)
20. [Pruebas automatizadas](#pruebas-automatizadas)
21. [Colección de Postman](#colección-de-postman)
22. [Arquitectura](#arquitectura)
23. [Estructura del proyecto](#estructura-del-proyecto)
24. [Modelo de datos](#modelo-de-datos)
25. [Problemas frecuentes](#problemas-frecuentes)
26. [Limitaciones conocidas](#limitaciones-conocidas)
27. [Flujo habitual después de descargar cambios](#flujo-habitual-después-de-descargar-cambios)

---

## Funcionalidades implementadas

**Cuentas y autenticación**
- Registro de usuarios, inicio de sesión y cierre de sesión con JWT.
- Consulta del perfil de la cuenta autenticada (`/auth/me`).
- Revocación de tokens al cerrar sesión y limpieza diaria automática de los tokens revocados vencidos.
- Control de acceso por roles: `ADMINISTRADOR`, `ARTESANO` y `POSTULANTE`.
- Alta de nuevos administradores, activación y desactivación de cuentas.

**Postulaciones**
- Postulación pública de artesanos, que crea en una sola transacción la cuenta, el perfil de artesano y la solicitud.
- Aprobación o rechazo de solicitudes por parte de un administrador, con actualización automática del rol y del estado del artesano.

**Gestión de la feria**
- CRUD de artesanos, productos, stands, localidades y ubicaciones.
- Listado de stands con paginación y filtros por estado, pabellón y localidad.
- Asignación de stands a artesanos aprobados.
- Publicación de productos por parte de cada artesano, con protección contra el acceso a productos ajenos (IDOR).

**Calidad**
- Validación de parámetros y cuerpos JSON con Zod, que rechaza campos no permitidos.
- Respuestas estructuradas para los errores de validación.
- Manejo centralizado de errores HTTP y de errores de Prisma.
- Documentación OpenAPI 3.0 generada desde el código y publicada con Swagger UI en `/docs`.
- Suite de pruebas automatizadas (unitarias, de acceso y de integración) sobre una base de datos aislada.

## Tecnologías utilizadas

| Categoría | Tecnología |
|---|---|
| Entorno de ejecución | Node.js 22 o superior (desarrollado con 22.23.2) |
| Gestor de paquetes | NPM |
| Framework HTTP | Express 5 |
| Base de datos | PostgreSQL |
| ORM | Prisma ORM 7 con `@prisma/adapter-pg` y `pg` |
| Validación | Zod 4 |
| Autenticación | `jsonwebtoken` (JWT HS256) y `bcryptjs` |
| Tareas programadas | `node-cron` |
| Documentación | `swagger-autogen` y `swagger-ui-express` |
| Pruebas | `node:test`, `node:assert` y `supertest` |
| Variables de entorno | `dotenv` y el flag nativo `--env-file` de Node |
| Módulos | ESM (`"type": "module"` en `package.json`) |

## Requisitos previos

Antes de instalar el proyecto se debe contar con:

- [Git](https://git-scm.com/) para clonar el repositorio.
- Node.js 22 o superior. Las pruebas usan `--env-file` y `--test-concurrency`, que no existen en versiones antiguas de Node.
- NPM, incluido con Node.js.
- PostgreSQL instalado y con el servicio en ejecución (de forma local o en un contenedor Docker).
- Una herramienta para probar APIs, por ejemplo Postman. También se puede usar Swagger UI, incluido en el proyecto.

Verificar las versiones activas:

```bash
node --version
npm --version
```

Si se usa un administrador de versiones como NVM:

```bash
nvm install 22
nvm use 22
```

## Obtener el proyecto

Para descargar el proyecto:

```bash
git clone https://github.com/champagneplease/Poncho-Digital.git
cd Poncho-Digital
```

Si el repositorio ya fue clonado:

```bash
git switch master
git pull origin master
```

## Instalar las dependencias

Desde la carpeta raíz del proyecto, donde está `package.json`, ejecutar:

```bash
npm install
```

La carpeta `node_modules` no forma parte del repositorio, por lo que `npm install` debe ejecutarse después de cada clonación.

## Archivos del repositorio

### Archivos que no deben incorporarse

El archivo `.gitignore` excluye:

| Ruta | Motivo |
|---|---|
| `node_modules/` | Dependencias descargadas por NPM. Se reconstruye con `npm install`. |
| `.env` | Contiene `DATABASE_URL`, `JWT_SECRET` y credenciales locales. |
| `src/generated/prisma` | Código generado localmente por Prisma. |

Nunca se deben publicar usuarios, contraseñas, secretos JWT ni cadenas de conexión reales. Antes de confirmar cambios conviene revisar:

```bash
git status
```

No se debe usar `git add .` sin comprobar primero que no se estén incorporando archivos sensibles.

### Archivos que sí se versionan

| Archivo | Contenido |
|---|---|
| `package.json` y `package-lock.json` | Dependencias, scripts y versiones exactas. |
| `.env.example` | Plantilla de variables de entorno con valores ficticios. |
| `.env.test` | Configuración del entorno de pruebas. Debe apuntar siempre a una base local de pruebas. |
| `prisma7.config.ts` | Configuración de Prisma CLI (schema, migraciones, seed y conexión). |
| `prisma/schema.prisma` | Definición del modelo de datos. |
| `prisma/migrations/` | Historial versionado de cambios de la base de datos. |
| `prisma/seed.js` | Carga de datos iniciales. |
| `generar-docs.js` y `swagger-output.json` | Generador y resultado de la documentación OpenAPI. |
| `postman/` | Colección y entorno de Postman. |
| `src/` | Código fuente de la API y pruebas. |

## Preparar PostgreSQL

El proyecto usa dos bases de datos:

| Base | Uso |
|---|---|
| `poncho_digital` | Desarrollo. La usa la API con `npm run dev`. |
| `poncho_digital_test` | Pruebas automatizadas. Se vacía antes de cada prueba. |

Pueden crearse desde pgAdmin o con una sesión SQL:

```sql
CREATE DATABASE poncho_digital;
CREATE DATABASE poncho_digital_test;
```

Si se prefiere Docker, un contenedor de PostgreSQL alcanza:

```bash
docker run --name poncho-postgres -e POSTGRES_PASSWORD=mi_clave -p 5432:5432 -d postgres:16
```

El servicio de PostgreSQL debe estar iniciado antes de ejecutar comandos de Prisma, la API o las pruebas.

## Configurar las variables de entorno

Copiar la plantilla y editarla:

```bash
cp .env.example .env
```

| Variable | Obligatoria | Descripción |
|---|:---:|---|
| `DATABASE_URL` | Sí | Cadena de conexión a la base de desarrollo. |
| `JWT_SECRET` | Sí | Clave para firmar los tokens. Si falta, la API no arranca y muestra `Falta configurar JWT_SECRET.` |
| `PORT` | No | Puerto HTTP. Por defecto `3000`. |
| `NODE_ENV` | No | `test` desactiva el servidor y el cron (lo usan las pruebas). `production` oculta el stack de los errores 500. |
| `ADMIN_API_KEY` | No | Reservada para el middleware `requireApiKey`, que hoy no está montado en ninguna ruta. |

Ejemplo ilustrativo de `.env`:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:mi_clave@localhost:5432/poncho_digital?schema=public"
JWT_SECRET="una_clave_larga_y_aleatoria"
NODE_ENV="development"
```

Si la contraseña tiene caracteres especiales, deben codificarse en la URL. Por ejemplo, `/` se escribe `%2F`.

El archivo `.env.test` ya existe en el repositorio. Cada integrante debe revisar que su `DATABASE_URL` use su usuario y contraseña locales y que el nombre de la base termine en `_test`.

## Preparar Prisma y la base de datos

Con las dependencias instaladas y `DATABASE_URL` configurada, ejecutar:

```bash
npx prisma validate
npx prisma migrate deploy
npx prisma generate
```

| Comando | Función |
|---|---|
| `prisma validate` | Comprueba la sintaxis de `schema.prisma`. |
| `prisma migrate deploy` | Aplica sobre la base las migraciones versionadas del proyecto. |
| `prisma generate` | Genera Prisma Client. |

Prisma CLI lee la configuración de `prisma7.config.ts`, que a su vez carga `.env` mediante `dotenv`.

Otros comandos útiles:

```bash
npx prisma migrate status   # estado de las migraciones
npx prisma studio           # interfaz gráfica para ver los datos
npx prisma migrate dev      # crear una nueva migración después de modificar el schema
```

## Datos iniciales (seed)

Para cargar datos de ejemplo en la base de desarrollo:

```bash
npx prisma db seed
```

El script `prisma/seed.js` es idempotente (se puede ejecutar varias veces) y crea:

| Dato | Valor |
|---|---|
| Administrador | `admin@poncho.gob.ar` / `Admin1234#` |
| Usuario artesano | `artesano@poncho.gob.ar` / `Artesano1234#` |
| Perfil de artesano | Juan Poncho, estado `APROBADO`, vinculado al usuario artesano |
| Localidad | San Fernando del Valle de Catamarca (id 1) |
| Ubicación | Pabellón Artesanías Tradicionales, Sector A (id 1) |
| Stand | Stand 1, estado `ocupado`, asignado al artesano |
| Producto | Poncho de Vicuña Catamarqueño, precio 850000 |

Estas credenciales son solo para desarrollo.

## Ejecutar la API

Modo desarrollo, con reinicio automático al modificar archivos:

```bash
npm run dev
```

Ejecución normal:

```bash
npm start
```

La API se inicia en `http://localhost:3000` y muestra:

```
Servidor de Poncho Digital corriendo en http://localhost:3000
```

Al iniciar también se programa la tarea de limpieza de tokens revocados. La API no tiene una ruta raíz: `GET /` responde 404. Para comprobar que funciona, abrir `http://localhost:3000/docs`.

## Instalación rápida

Para una copia recién descargada, con PostgreSQL en ejecución y las bases creadas:

```bash
npm install
cp .env.example .env          # editar DATABASE_URL y JWT_SECRET
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
npm run docs
npm run dev
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Ejecuta la API con `node --watch`. |
| `npm start` | Ejecuta la API sin observación de cambios. |
| `npm run docs` | Genera `swagger-output.json` a partir de las rutas y los esquemas. |
| `npm test` | Ejecuta toda la suite de pruebas con `.env.test`, de a un archivo por vez. |
| `npm run test:integracion` | Ejecuta solo las pruebas de integración. |

## Documentación interactiva (Swagger)

La documentación sigue la especificación OpenAPI 3.0 y se publica en:

```
http://localhost:3000/docs
```

### Cómo se genera

1. `generar-docs.js` usa `swagger-autogen` con `src/app.js` como archivo raíz. Desde ahí recorre todos los routers montados.
2. Cada ruta tiene un comentario `#swagger` con `tags`, `summary`, parámetros, cuerpo, respuestas y seguridad.
3. Los esquemas de entrada se convierten desde los validadores Zod con `z.toJSONSchema(schema, { target: "openapi-3.0", io: "input" })`, en `src/documentacion/esquemas.js`. Así la documentación y la validación usan la misma definición.
4. Los esquemas de respuesta se describen con `properties` y `required` en el mismo archivo, junto con `ErrorApi`, el formato común de error.
5. Todos los esquemas se registran con la clave `@schemas` y las rutas los referencian con `$ref`.
6. El resultado se guarda en `swagger-output.json`. `src/app.js` lo publica en `/docs` antes del manejador 404.

Después de modificar rutas o validadores, regenerar la documentación:

```bash
npm run docs
```

Si `swagger-output.json` no existe, la API arranca igual pero no monta `/docs`.

### Probar endpoints protegidos

1. Abrir `POST /auth/login`, presionar **Try it out** y enviar, por ejemplo:
   ```json
   { "email": "artesano@poncho.gob.ar", "password": "Artesano1234#" }
   ```
2. Copiar el valor de `token` de la respuesta.
3. Presionar **Authorize** y pegar solo el token, sin escribir `Bearer`.
4. Las operaciones con candado ya se pueden ejecutar con **Try it out**.

## Autenticación y autorización

### Tokens

- La API emite tokens JWT firmados con HS256 y `JWT_SECRET`.
- Los tokens vencen a los **15 minutos**.
- El token contiene `sub` (id del usuario) y `jti` (identificador único del token). El rol no viaja en el token: se lee de la base en cada solicitud, por lo que un cambio de rol o una desactivación se aplica de inmediato.
- Se envían en el encabezado:
  ```
  Authorization: Bearer <token>
  ```

### Controles en cada solicitud protegida

Las rutas protegidas encadenan estos middlewares de `src/middlewares/auth-middlewares.js`:

| Middleware | Qué verifica | Respuesta si falla |
|---|---|---|
| `autenticarUsuario` | Que exista el encabezado | 401 `Se requiere un token de acceso.` |
| | Que tenga el formato `Bearer <token>` | 400 `Usar Authorization: Bearer <token>.` |
| | Firma, vencimiento, contenido y que no esté revocado | 401 `Token inválido, vencido o revocado.` |
| `cargarContextoCuenta` | Que la cuenta exista | 401 `La cuenta ya no existe.` |
| | Que la cuenta esté activa | 403 `Cuenta desactivada. Acceso prohibido.` |
| `autorizarRoles(...)` | Que el rol esté permitido | 403 `Acceso prohibido. Se requiere uno de los siguientes roles: ...` |

Las respuestas 400 y 401 de autenticación incluyen el encabezado `WWW-Authenticate`.

### Cierre de sesión y revocación

- `POST /auth/logout` guarda el `jti` del token en la tabla `TokenRevocado` junto con su fecha de vencimiento. Desde ese momento el token responde 401.
- La tarea `src/tasks/cleanup-tokens.js` se ejecuta todos los días a las 00:00 y elimina los registros cuyo token ya venció.

### Roles

| Rol | Cómo se obtiene | Puede |
|---|---|---|
| `ADMINISTRADOR` | Seed o `POST /usuarios/admin` | Gestionar usuarios, solicitudes, artesanos y stands. |
| `ARTESANO` | Aprobación de una solicitud, seed o `POST /auth/registro` | Gestionar sus propios productos (requiere perfil de artesano vinculado). |
| `POSTULANTE` | `POST /auth/postulacion` | Iniciar sesión y consultar su perfil mientras espera la aprobación. |

## Endpoints disponibles

Columna **Acceso**: *Público* no requiere token; *Autenticado* requiere cualquier token válido; *Admin* y *Artesano* requieren además ese rol.

### Autenticación (`/auth`)

| Método | Endpoint | Acceso | Descripción | Respuestas |
|---|---|---|---|---|
| POST | `/auth/registro` | Público | Registra un usuario con rol `ARTESANO`. | 201, 400, 409 |
| POST | `/auth/login` | Público | Inicia sesión y devuelve el token. | 200, 400, 401 |
| POST | `/auth/postulacion` | Público | Postulación pública de artesano. | 201, 400, 409 |
| POST | `/auth/logout` | Autenticado | Revoca el token actual. | 204, 400, 401 |
| GET | `/auth/me` | Autenticado | Perfil de la cuenta y artesano asociado. | 200, 400, 401 |

### Usuarios (`/usuarios`)

| Método | Endpoint | Acceso | Descripción | Respuestas |
|---|---|---|---|---|
| GET | `/usuarios` | Admin | Lista todas las cuentas. | 200, 400, 401, 403 |
| POST | `/usuarios/admin` | Admin | Crea un administrador. | 201, 400, 401, 403, 409 |
| PATCH | `/usuarios/:id/activo` | Admin | Activa o desactiva una cuenta (`:id` es UUID). | 200, 400, 401, 403, 404, 409 |

### Solicitudes (`/solicitudes`)

| Método | Endpoint | Acceso | Descripción | Respuestas |
|---|---|---|---|---|
| GET | `/solicitudes` | Admin | Lista las solicitudes, de la más reciente a la más antigua. | 200, 400, 401, 403 |
| PATCH | `/solicitudes/:id` | Admin | Aprueba o rechaza una solicitud (`:id` numérico). | 200, 400, 401, 403, 404, 409 |

### Artesanos (`/artesanos`)

| Método | Endpoint | Acceso | Descripción | Respuestas |
|---|---|---|---|---|
| GET | `/artesanos` | Público | Lista artesanos con localidad, stand y productos. | 200 |
| GET | `/artesanos/:id` | Público | Obtiene un artesano (`:id` es UUID). | 200, 404 |
| POST | `/artesanos/postulacion` | Público | Alias de `POST /auth/postulacion`. | 201, 400, 409 |
| POST | `/artesanos` | Admin | Crea un perfil de artesano. | 201, 400, 401, 403 |
| PUT | `/artesanos/:id` | Admin | Actualiza un artesano (actualización parcial). | 200, 400, 401, 403, 404 |
| PATCH | `/artesanos/:id/estado` | Admin | Cambia el estado de aprobación. | 200, 400, 401, 403, 404 |
| DELETE | `/artesanos/:id` | Admin | Elimina un artesano. | 204, 400, 401, 403, 404 |

### Productos (`/productos`)

| Método | Endpoint | Acceso | Descripción | Respuestas |
|---|---|---|---|---|
| GET | `/productos` | Público | Lista todos los productos con su artesano. | 200 |
| GET | `/productos/mis-productos` | Artesano | Lista los productos del artesano autenticado. | 200, 400, 401, 403 |
| GET | `/productos/:id` | Público | Obtiene un producto (`:id` numérico). | 200, 400, 404 |
| POST | `/productos` | Artesano | Crea un producto propio. | 201, 400, 401, 403 |
| PUT | `/productos/:id` | Artesano | Actualiza un producto propio (actualización parcial). | 200, 400, 401, 403, 404 |
| DELETE | `/productos/:id` | Artesano | Elimina un producto propio. | 204, 400, 401, 403, 404 |

### Stands (`/stands`)

| Método | Endpoint | Acceso | Descripción | Respuestas |
|---|---|---|---|---|
| GET | `/stands` | Público | Lista stands con paginación y filtros. | 200 |
| POST | `/stands` | Admin | Crea un stand. | 201, 400, 401, 403 |
| PUT | `/stands/:id` | Admin | Actualiza o asigna un stand (actualización parcial). | 200, 400, 401, 403, 404 |
| DELETE | `/stands/:id` | Admin | Elimina un stand. | 204, 400, 401, 403, 404 |

Parámetros de consulta de `GET /stands`:

| Parámetro | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `page` | entero | 1 | Número de página. |
| `limit` | entero | 10 | Cantidad de stands por página. |
| `estado` | texto | | Coincidencia exacta, por ejemplo `disponible` u `ocupado`. |
| `pabellon` | texto | | Coincidencia exacta con el pabellón de la ubicación. |
| `localidad` | texto | | Coincidencia parcial, sin distinguir mayúsculas, con la localidad del artesano. |

Ejemplo: `GET /stands?estado=disponible&page=1&limit=10`

Forma de la respuesta:

```json
{
  "data": [ { "id": 1, "estado": "ocupado", "ubicacion": { }, "artesano": { } } ],
  "meta": { "total": 25, "paginaActual": 1, "limite": 10, "totalPaginas": 3 }
}
```

### Localidades (`/localidades`) y ubicaciones (`/ubicaciones`)

| Método | Endpoint | Acceso | Descripción | Respuestas |
|---|---|---|---|---|
| GET | `/localidades` | Público | Lista localidades con sus artesanos. | 200 |
| POST | `/localidades` | Público | Crea una localidad. | 201, 400 |
| PUT | `/localidades/:id` | Público | Actualiza una localidad (actualización parcial). | 200, 400, 404 |
| DELETE | `/localidades/:id` | Público | Elimina una localidad. | 204, 400, 404 |
| GET | `/ubicaciones` | Público | Lista ubicaciones con sus stands. | 200 |
| POST | `/ubicaciones` | Público | Crea una ubicación. | 201, 400 |
| PUT | `/ubicaciones/:id` | Público | Actualiza una ubicación (actualización parcial). | 200, 400, 404 |
| DELETE | `/ubicaciones/:id` | Público | Elimina una ubicación. | 204, 400, 404 |

### Documentación

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/docs` | Swagger UI con la especificación OpenAPI 3.0. |

## Cuerpos JSON de las solicitudes

Todos los esquemas son estrictos, salvo el de login: si se envía un campo que no figura en la tabla, la API responde 400 con `Unrecognized key`. Los textos se recortan (`trim`) antes de validarse. En las operaciones `PUT`, todos los campos pasan a ser opcionales.

### Registro (`POST /auth/registro`)

```json
{ "nombre": "Carlos Tejedor", "email": "carlos@ejemplo.com", "password": "Password1234#" }
```

| Campo | Regla |
|---|---|
| `nombre` | Obligatorio, al menos 2 caracteres. |
| `email` | Obligatorio, formato de email válido. |
| `password` | Obligatorio, al menos 8 caracteres. |

### Login (`POST /auth/login`)

```json
{ "email": "admin@poncho.gob.ar", "password": "Admin1234#" }
```

Respuesta 200:

```json
{
  "mensaje": "Credenciales verificadas correctamente.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": { "id": "uuid", "nombre": "...", "email": "...", "rol": "ADMINISTRADOR", "artesanoId": null }
}
```

### Postulación (`POST /auth/postulacion`)

```json
{
  "nombre": "María",
  "apellido": "Orfebre",
  "email": "maria@ejemplo.com",
  "password": "Password1234#",
  "telefono": "+54 383 4991122",
  "localidadId": 1,
  "motivo": "Platería criolla tradicional"
}
```

| Campo | Regla |
|---|---|
| `nombre` | Obligatorio, al menos 2 caracteres. |
| `email` | Obligatorio, formato de email válido. |
| `password` | Obligatorio, al menos 8 caracteres. |
| `apellido`, `telefono`, `motivo` | Opcionales. |
| `localidadId` | Opcional, entero positivo de una localidad existente. |

### Crear administrador (`POST /usuarios/admin`)

```json
{ "nombre": "Ana Admin", "email": "ana@poncho.gob.ar", "password": "Password1234#" }
```

Mismas reglas que el registro.

### Activar o desactivar cuenta (`PATCH /usuarios/:id/activo`)

```json
{ "activo": false }
```

`activo` es obligatorio y booleano.

### Resolver solicitud (`PATCH /solicitudes/:id`)

```json
{ "estado": "APROBADA", "motivo": "Documentación verificada" }
```

| Campo | Regla |
|---|---|
| `estado` | Obligatorio: `APROBADA` o `RECHAZADA`. |
| `motivo` | Opcional. Si no se envía, se conserva el anterior. |

### Artesano (`POST /artesanos`, `PUT /artesanos/:id`)

```json
{ "nombre": "Juan", "apellido": "Poncho", "telefono": "+54 383 4123456", "localidadId": 1 }
```

| Campo | Regla |
|---|---|
| `nombre` | Obligatorio, al menos 2 caracteres. |
| `apellido` | Obligatorio, al menos 2 caracteres. |
| `telefono` | Opcional. |
| `localidadId` | Opcional, entero positivo. |

El estado no se envía en este cuerpo; se cambia con `PATCH /artesanos/:id/estado`.

### Estado de artesano (`PATCH /artesanos/:id/estado`)

```json
{ "estado": "APROBADO" }
```

`estado` es obligatorio: `PENDIENTE`, `APROBADO` o `RECHAZADO`.

### Producto (`POST /productos`, `PUT /productos/:id`)

```json
{ "nombre": "Vasija de Barro Calchaquí", "precio": 45000 }
```

| Campo | Regla |
|---|---|
| `nombre` | Obligatorio, al menos 2 caracteres. |
| `precio` | Obligatorio, número mayor que 0. |

El `artesanoId` no se envía: el servidor lo toma de la cuenta autenticada. Si se incluye, la solicitud se rechaza con 400.

### Stand (`POST /stands`, `PUT /stands/:id`)

```json
{ "ubicacionId": 1, "coordenadas": "-28.4689,-65.7795" }
```

Para asignar o liberar un stand:

```json
{ "artesanoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6" }
```

```json
{ "artesanoId": null }
```

| Campo | Regla |
|---|---|
| `ubicacionId` | Obligatorio en el alta, entero positivo de una ubicación existente. |
| `coordenadas` | Opcional. |
| `artesanoId` | Opcional. UUID de un artesano, o `null` para liberar el stand. |

El estado del stand no se envía: lo calcula el servidor (ver reglas de negocio).

### Localidad y ubicación

```json
{ "nombre": "Belén", "provincia": "Catamarca" }
```

```json
{ "pabellon": "Pabellón Norte", "sector": "Sector B" }
```

| Recurso | Campo | Regla |
|---|---|---|
| Localidad | `nombre` | Obligatorio, al menos 2 caracteres. |
| Localidad | `provincia` | Opcional. |
| Ubicación | `pabellon` | Obligatorio. |
| Ubicación | `sector` | Obligatorio. |

## Reglas de negocio

**Postulación y aprobación**
1. `POST /auth/postulacion` crea, en una única transacción, un usuario con rol `POSTULANTE`, un perfil de artesano en estado `PENDIENTE` y una solicitud `PENDIENTE`.
2. Si un administrador **aprueba** la solicitud, el usuario pasa a rol `ARTESANO` y el artesano a estado `APROBADO`.
3. Si la **rechaza**, el artesano pasa a estado `RECHAZADO` y el usuario conserva el rol `POSTULANTE`.
4. Una solicitud ya resuelta no puede resolverse otra vez: responde 409.

**Productos**
- Solo un usuario con rol `ARTESANO` y con un perfil de artesano vinculado puede crear productos. Un usuario creado con `POST /auth/registro` tiene rol `ARTESANO` pero no tiene perfil, por lo que recibe 403.
- El producto queda asociado al artesano de la cuenta autenticada.
- Modificar o eliminar un producto ajeno responde **404**, igual que si no existiera, para no revelar que el recurso existe. Internamente se filtra por `id` y por `artesanoId` en la misma consulta.

**Stands**
- Al asignar un artesano con `PUT /stands/:id`, el artesano debe existir y estar `APROBADO`; si no, responde 400. El stand pasa a estado `ocupado`.
- Al enviar `artesanoId: null`, el stand pasa a estado `disponible`.
- Un artesano solo puede tener un stand: asignarle un segundo responde 409.

**Cuentas**
- No se puede desactivar al único administrador activo: responde 409.
- Una cuenta desactivada no puede iniciar sesión y recibe 403 en las rutas que verifican el rol.
- El login responde siempre `Las credenciales son inválidas.` (email inexistente, contraseña incorrecta o cuenta inactiva), para no revelar qué dato falló.
- Las contraseñas se guardan con bcrypt y nunca se devuelven en las respuestas.

**Eliminaciones en cascada**
- Al eliminar un artesano se eliminan sus productos y solicitudes, y su stand queda libre.
- Al eliminar un usuario se elimina su perfil de artesano y sus solicitudes.
- Al eliminar una localidad, sus artesanos quedan sin localidad.
- Una ubicación con stands no se puede eliminar: la base rechaza la operación.

## Respuestas de error y códigos HTTP

### Formato

Error general:

```json
{ "mensaje": "Producto no encontrado." }
```

Error de validación:

```json
{
  "mensaje": "Los datos enviados son inválidos.",
  "errores": [
    { "campo": "precio", "mensaje": "El precio debe ser mayor a 0" }
  ]
}
```

En los errores 500, fuera de producción, la respuesta incluye además el campo `detalle` con el stack del error.

### Códigos HTTP

| Código | Uso en el proyecto |
|---|---|
| 200 OK | Consulta o actualización exitosa. |
| 201 Created | Recurso creado. |
| 204 No Content | Recurso eliminado o sesión cerrada. |
| 400 Bad Request | Datos inválidos, campos no permitidos, JSON mal formado, ID no numérico, encabezado `Authorization` mal formado o registro relacionado inexistente. |
| 401 Unauthorized | Falta el token, el token es inválido, venció o fue revocado, o las credenciales son incorrectas. |
| 403 Forbidden | Rol no permitido o cuenta desactivada. |
| 404 Not Found | Recurso o ruta inexistente, o recurso de otro usuario. |
| 409 Conflict | Email ya registrado, solicitud ya resuelta, artesano con stand asignado o último administrador activo. |
| 500 Internal Server Error | Error inesperado del servidor. |

### Errores de Prisma

El manejador central (`src/middlewares/error-handler.js`) traduce los errores de Prisma:

| Código Prisma | Significado | Respuesta |
|---|---|---|
| `P2025` | El registro no existe | 404 |
| `P2002` | Valor único repetido | 409 |
| `P2003` | Clave foránea inexistente | 400 |

## Pruebas automatizadas

Las pruebas usan el runner nativo de Node (`node:test`) y `supertest`, que envía solicitudes HTTP a la aplicación sin levantar el servidor.

### Preparar la base de pruebas

1. Crear la base `poncho_digital_test` (ver [Preparar PostgreSQL](#preparar-postgresql)).
2. Revisar `DATABASE_URL` en `.env.test`.
3. Aplicar las migraciones sobre esa base.

   macOS o Linux:
   ```bash
   DATABASE_URL="postgresql://USUARIO:CONTRASENA@localhost:5432/poncho_digital_test?schema=public" npx prisma migrate deploy
   ```

   Windows (PowerShell):
   ```powershell
   $env:DATABASE_URL="postgresql://USUARIO:CONTRASENA@localhost:5432/poncho_digital_test?schema=public"
   npx prisma migrate deploy
   Remove-Item Env:DATABASE_URL
   ```

### Ejecutar

```bash
npm test                   # toda la suite
npm run test:integracion   # solo integración
```

No hace falta tener `npm run dev` en ejecución y el proceso termina solo. El resultado esperado es `tests 21`, `pass 21`, `fail 0`.

### Cómo se aísla el entorno

- `.env.test` define `NODE_ENV=test` y apunta a `poncho_digital_test`. Se carga con `node --env-file=.env.test`.
- Con `NODE_ENV=test`, `src/app.js` exporta la app sin ejecutar `app.listen` ni la tarea programada.
- Antes de importar la app, los archivos de prueba verifican que `NODE_ENV` sea `test` y que `DATABASE_URL` contenga `_test`. Si no se cumple, se detienen sin conectarse a la base. Por eso la app se importa con `await import()` después de esas verificaciones.
- En cada `beforeEach` se vacían las tablas en orden de dependencias (primero las tablas hijas y al final `Usuario`).
- En el `after` se cierra Prisma y el pool de conexiones con `desconectarDb()`.
- `npm test` usa `--test-concurrency=1` porque todos los archivos comparten la misma base: si se ejecutaran en paralelo, la limpieza de uno borraría los datos de otro.

### Archivos de prueba

| Archivo | Tipo | Qué verifica |
|---|---|---|
| `src/tests/esquemas.test.js` | Unitaria | Tabla de casos válidos e inválidos de `productoSchema` con `safeParse`, incluido el rechazo de `artesanoId`. También que el registro rechace `rol` y `activo`, que la postulación rechace `estado` y `rol`, y los estados válidos al resolver solicitudes. |
| `src/tests/acceso.test.js` | Acceso | Sobre `POST /productos`: sin token 401, encabezado mal formado 400, token inválido 401 y rol no permitido 403. En cada caso comprueba código y cuerpo. |
| `src/tests/integracion.test.js` | Integración | Alta de producto verificada en la base y asociada a la cuenta autenticada. Modificación y eliminación de un producto ajeno con 404, comprobando en la base que sigue existiendo, con el mismo dueño y sin cambios. Flujo de sesión (me, logout y token revocado). Flujo de postulación, aprobación y 409 al resolver de nuevo. |

### Script de verificación manual

`src/tests/rubric-test.js` es un recorrido de punta a punta que levanta la app en el puerto 3002 y usa las credenciales del seed. No forma parte de `npm test`. Como las pruebas automáticas vacían la base de pruebas, hay que cargar el seed antes de ejecutarlo:

```bash
DATABASE_URL="postgresql://USUARIO:CONTRASENA@localhost:5432/poncho_digital_test?schema=public" npx prisma db seed
node --env-file=.env.test src/tests/rubric-test.js
```

## Colección de Postman

La carpeta `postman/` contiene:

- `collections/Poncho_Digital_API.postman_collection.json`: 26 solicitudes organizadas en 7 carpetas.
- `environments/Poncho_Digital_Local.postman_environment.json`: entorno con `baseUrl = http://localhost:3000`.

Para usarla:

1. Cargar el seed en la base de desarrollo (`npx prisma db seed`) e iniciar la API.
2. Importar la colección y el entorno en Postman, y seleccionar el entorno **Poncho Digital - Local**.
3. Ejecutar las carpetas en orden. Las solicitudes de login guardan los tokens (`adminToken`, `artesanoToken`, `postulanteToken`) y los identificadores necesarios para las siguientes.

| Carpeta | Contenido |
|---|---|
| 1. Autenticación y Perfil | Login de administrador y artesano, perfil propio. |
| 2. Postulación y Resolución de Solicitudes | Postulación, intento de crear producto como postulante (403), aprobación y doble resolución (409). |
| 3. Productos (Rol Artesano y Anti-IDOR) | Alta, listado propio y público, modificación de producto ajeno (404). |
| 4. Stands (Gestión y Asignación Admin) | Intento como artesano (403), alta, asignación y listado con filtros. |
| 5. Gestión de Cuentas (Solo Admin) | Alta de administrador, listado, desactivación y último administrador (409). |
| 6. Consultas Públicas | Artesanos, localidades y ubicaciones. |
| 7. Logout y Revocación de Tokens | Cierre de sesión y uso del token revocado (401). |

## Arquitectura

El proyecto sigue un diseño por capas: **rutas, middlewares, controladores, servicios y acceso a datos**.

```mermaid
flowchart LR
    C["Cliente"] --> A["app.js"]
    A --> R["routes/index.js"]
    R --> M1["autenticarUsuario"]
    M1 --> M2["cargarContextoCuenta"]
    M2 --> M3["autorizarRoles"]
    M3 --> M4["validateSchema (Zod)"]
    M4 --> CT["Controlador"]
    CT --> S["Servicio"]
    S --> P["Prisma Client"]
    P --> DB[("PostgreSQL")]
    CT -. "next(error)" .-> E["errorHandler"]
```

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| Aplicación | `src/app.js` | Configura Express, monta rutas, `/docs`, el 404 y el manejador de errores. Inicia el servidor y el cron fuera de `NODE_ENV=test`. |
| Rutas | `src/routes/` | Define los endpoints, la cadena de middlewares y la documentación `#swagger` de cada uno. |
| Middlewares | `src/middlewares/` | Autenticación, contexto de cuenta, roles, validación y manejo de errores. |
| Validación | `src/schemas/` | Esquemas Zod de entrada. |
| Controladores | `src/controllers/` | Leen la solicitud, llaman al servicio y arman la respuesta HTTP. |
| Servicios | `src/services/` | Reglas de negocio y consultas a la base. |
| Configuración | `src/config/` | Conexión a la base (Prisma con adaptador `pg`) y lectura de `JWT_SECRET`. |
| Tareas | `src/tasks/` | Limpieza diaria de tokens revocados. |
| Documentación | `src/documentacion/` | Esquemas OpenAPI derivados de Zod y esquemas de respuesta. |

Un ejemplo completo, `POST /productos`:

1. `autenticarUsuario` valida el token y deja el id del usuario en `req.usuario`.
2. `cargarContextoCuenta` busca la cuenta, verifica que esté activa y agrega su rol y su `artesanoId`.
3. `autorizarRoles('ARTESANO')` comprueba el rol.
4. `validateSchema(productoSchema)` valida el cuerpo y rechaza campos extra.
5. El controlador toma el `artesanoId` de la cuenta y llama al servicio.
6. El servicio crea el producto con Prisma y el controlador responde 201.
7. Si algo falla, el error llega a `errorHandler`, que responde con el código adecuado.

## Estructura del proyecto

```
Poncho-Digital/
├── postman/
│   ├── collections/          # colección de Postman
│   └── environments/         # entorno local de Postman
├── prisma/
│   ├── migrations/           # historial de migraciones
│   ├── schema.prisma         # modelo de datos
│   └── seed.js               # datos iniciales
├── src/
│   ├── config/
│   │   ├── db.js             # Prisma Client, pool de pg y desconectarDb()
│   │   └── jwt.js            # lectura y validación de JWT_SECRET
│   ├── controllers/          # un controlador por recurso
│   ├── documentacion/
│   │   └── esquemas.js       # esquemas OpenAPI (Zod y respuestas)
│   ├── middlewares/
│   │   ├── auth-middlewares.js
│   │   ├── auth-validator.js # requireApiKey (sin uso actualmente)
│   │   ├── error-handler.js
│   │   └── zod-validator.js
│   ├── routes/               # un router por recurso e index.js
│   ├── schemas/
│   │   ├── auth-validations.js
│   │   └── validations.js
│   ├── services/             # lógica de negocio, tokens y revocaciones
│   ├── tasks/
│   │   └── cleanup-tokens.js # cron diario
│   ├── tests/                # pruebas automatizadas y script manual
│   └── app.js
├── .env                      # configuración local, no versionada
├── .env.example              # plantilla de variables
├── .env.test                 # configuración de pruebas
├── generar-docs.js           # generador de swagger-output.json
├── swagger-output.json       # especificación OpenAPI generada
├── prisma7.config.ts         # configuración de Prisma CLI
├── package.json
└── package-lock.json
```

## Modelo de datos

```mermaid
erDiagram
    Usuario ||--o| Artesano : "tiene perfil"
    Usuario ||--o{ Solicitud : "realiza"
    Artesano ||--o{ Solicitud : "asociada"
    Localidad ||--o{ Artesano : "agrupa"
    Artesano ||--o{ Producto : "publica"
    Artesano ||--o| Stand : "ocupa"
    Ubicacion ||--o{ Stand : "contiene"
```

| Modelo | Clave | Campos principales |
|---|---|---|
| `Usuario` | UUID | `nombre`, `email` (único), `passwordHash`, `rol`, `activo`, `ultimoAcceso` |
| `Artesano` | UUID | `nombre`, `apellido`, `telefono`, `estado`, `usuarioId` (único), `localidadId` |
| `Solicitud` | entero | `estado`, `motivo`, `usuarioId`, `artesanoId` |
| `Producto` | entero | `nombre`, `precio`, `artesanoId` |
| `Stand` | entero | `estado`, `coordenadas`, `ubicacionId`, `artesanoId` (único) |
| `Localidad` | entero | `nombre`, `provincia` |
| `Ubicacion` | entero | `pabellon`, `sector` |
| `TokenRevocado` | `jti` | `venceEn` (indexado) |

Todos los modelos, salvo `TokenRevocado`, tienen `createdAt` y `updatedAt`.

**Enumeraciones**

| Enum | Valores |
|---|---|
| `Rol` | `ADMINISTRADOR`, `ARTESANO`, `POSTULANTE` |
| `EstadoSolicitud` | `PENDIENTE`, `APROBADA`, `RECHAZADA` |

El estado del artesano (`PENDIENTE`, `APROBADO`, `RECHAZADO`) y el del stand (`disponible`, `ocupado`) son campos de texto controlados por la validación y los servicios.

**Relaciones**

| Relación | Tipo | Al eliminar |
|---|---|---|
| Usuario - Artesano | 1:1 opcional | Se elimina el artesano |
| Usuario - Solicitud | 1:N | Se eliminan las solicitudes |
| Artesano - Solicitud | 1:N | Se eliminan las solicitudes |
| Artesano - Producto | 1:N | Se eliminan los productos |
| Artesano - Stand | 1:1 opcional | El stand queda sin artesano |
| Localidad - Artesano | 1:N | Los artesanos quedan sin localidad |
| Ubicacion - Stand | 1:N | Restringido: no se puede eliminar si tiene stands |

## Problemas frecuentes

**`Falta configurar JWT_SECRET.`**
Falta la variable en `.env` (o en `.env.test` al correr las pruebas).

**Prisma no puede conectarse con PostgreSQL (`ECONNREFUSED` o error en `deleteMany()` al correr las pruebas)**
Comprobar que el servicio esté iniciado, que el host, puerto, usuario y contraseña sean correctos y que la base exista. Si PostgreSQL corre en Docker, `docker ps` debe mostrar el puerto publicado (`0.0.0.0:5432->5432/tcp`). Si el contenedor está en ejecución pero no publica el puerto:

```bash
docker restart <nombre-del-contenedor>
# o, si sigue sin publicarlo:
docker network connect bridge <nombre-del-contenedor>
```

**Las pruebas se detienen con `NODE_ENV debe ser "test"` o `DATABASE_URL debe apuntar a una base de datos de pruebas`**
Se ejecutó un archivo de prueba sin `--env-file=.env.test`, o `.env.test` apunta a una base cuyo nombre no termina en `_test`. Usar `npm test`.

**Las pruebas fallan con errores de tablas inexistentes**
Faltan las migraciones en la base de pruebas. Ver [Preparar la base de pruebas](#preparar-la-base-de-pruebas).

**`/docs` responde 404**
Falta `swagger-output.json`. Ejecutar `npm run docs` y reiniciar la API.

**No se encuentra Prisma Client**
Ejecutar `npx prisma generate`.

**El login del seed falla**
Ejecutar `npx prisma db seed` sobre la base que usa la API.

**El puerto 3000 está ocupado**
Cerrar el proceso que lo usa o definir otro `PORT` en `.env`.

## Limitaciones conocidas

- Los endpoints de escritura de `/localidades` y `/ubicaciones` no requieren autenticación.
- El middleware `requireApiKey` y la variable `ADMIN_API_KEY` están definidos pero no se usan en ninguna ruta.
- `GET /stands` no establece un máximo para `limit`.
- `POST /stands` acepta `artesanoId` sin verificar que el artesano esté aprobado; esa verificación solo se hace en `PUT /stands/:id`.
- Algunas respuestas de `/artesanos` usan la clave `error` en lugar de `mensaje`.

## Flujo habitual después de descargar cambios

Cuando se actualiza la rama y pueden haber cambiado las dependencias, el schema o las rutas:

```bash
git pull
npm install
npx prisma migrate deploy
npx prisma generate
npm run docs
npm run dev
```

Si cambiaron las migraciones, aplicarlas también sobre la base de pruebas antes de ejecutar `npm test`.

## Repositorio

https://github.com/champagneplease/Poncho-Digital
