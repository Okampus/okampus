.\tools\scripts\docker\load-env.ps1 .\apps\site\.env.development; .\tools\scripts\docker\load-env.ps1 .\apps\site\.env;
Write-Host "Launching prisma studio..."
$env:DATABASE_URL = "postgres://${env:PSQL_USER}:${env:PSQL_PASSWORD}@${env:PSQL_HOST}:${env:POSTGRES_PUBLISHED_PORT}/${env:POSTGRES_DB}"
pnpm prisma studio --schema apps/site/database/prisma/schema.prisma
