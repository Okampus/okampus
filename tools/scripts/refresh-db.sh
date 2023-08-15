dropdb -h localhost -U postgres -f okampus
createdb -h localhost -U postgres okampus
pnpm nx run api:migration:up
pnpm nx run api:hasura:metadata:apply
pnpm nx run shared-graphql:codegen
bash apps/api/database/hasura/run.sh -d
pnpm nx run api:serve