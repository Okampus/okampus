# Compile migrations to js in dist folder (migrations should be up-to-date in apps/api/database/migrations)
pnpm tsc --pretty -p apps/api/tsconfig.migrations.json;
# Workaround for `pnpm mikro-orm migration:up` without CLI & ts-node
pnpm cross-env MIKRO_ORM_MIGRATION=up node dist/apps/api/main.mjs;