## PostgreSQL con Docker

1. Copia las variables de entorno base:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

2. Levanta PostgreSQL en Docker:

```bash
docker compose up -d
```

3. Ejecuta migraciones:

```bash
npm run db:migration:run
```

4. Limpiar la bd y dejarla de cero:

```bash
docker compose down
docker compose down -v

```

5. Inicia la API:

```bash
npm run start:dev
```

En este flujo `synchronize` queda desactivado y los cambios de schema se controlan con migraciones versionadas.

### Comandos de migraciones

```bash
# crear una migracion vacia
npm run db:migration:create

# generar migracion desde cambios en entidades
npm run db:migration:generate

# ejecutar migraciones pendientes
npm run db:migration:run

# revertir la ultima migracion ejecutada
npm run db:migration:revert
```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
