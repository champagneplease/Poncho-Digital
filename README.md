# Poncho Digital - API REST

API REST desarrollada para la plataforma web "Poncho Digital", destinada a gestionar y brindar información sobre artesanos, productos y stands de la Feria de la Fiesta Nacional e Internacional del Poncho.

Este proyecto corresponde al Trabajo de Laboratorio integrador de la cátedra **Desarrollo Backend** de la Tecnicatura Universitaria en Diseño de Software (U.N.Ca.).

## Integrantes del Equipo

- Benjamín Jeremías Cano
- Miranda Juan Ignacio

## Tecnologías Utilizadas

- **Entorno de ejecución:** Node.js 24.x LTS
- **Framework:** Express.js 5.x
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma 7
- **Arquitectura:** Módulos ESM (`"type": "module"`) y patrón de diseño por capas (Rutas, Controladores, Servicios).

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrese de contar con los siguientes requerimientos en su entorno local:

- Node.js (versión 24.x LTS o superior)
- PostgreSQL (servicio activo localmente)
- Git (para el control de versiones)

## Configuración e Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/champagneplease/Poncho-Digital.git
   cd Poncho-Digital
   ```

2. **Instalar dependencias:**

   Asegúrese de instalar los paquetes necesarios listados en el archivo package.json:

   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**

   Copie el archivo de ejemplo proporcionado para establecer la configuración local:

   ```bash
   cp .env.example .env
   ```
   
   A continuación, edite el archivo `.env` recién creado y actualice la variable `DATABASE_URL` con sus credenciales correspondientes de PostgreSQL.

4. **Configuración de la Base de Datos (Prisma):**

   Ejecute el siguiente comando para migrar y sincronizar las tablas en su base de datos local:

   ```bash
   npx prisma migrate dev
   ```

   Una vez finalizada la migración, genere el cliente de Prisma para que el servidor pueda interactuar con la base de datos:

   ```bash
   npx prisma generate
   ```

## Ejecución del Servidor

Para iniciar el proyecto en el entorno de desarrollo y probar la API localmente, utilice el comando:

```bash
npm run dev
```

El servidor estará en ejecución y escuchando peticiones en: `http://localhost:3000`.
