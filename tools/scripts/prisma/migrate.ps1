.\tools\scripts\docker\load-env.ps1 .\apps\site\.env.development; .\tools\scripts\docker\load-env.ps1 .\apps\site\.env;
 $env:DATABASE_URL="postgres://"+$env:PSQL_USER+":"+$env:PSQL_PASSWORD+"@"+$env:PSQL_HOST+":"+$env:POSTGRES_PUBLISHED_PORT+"/"+$env:POSTGRES_DB; 
 prisma migrate dev --schema apps/site/database/prisma/schema.prisma; pnpm prisma generate
