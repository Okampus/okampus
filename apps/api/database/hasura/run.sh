#!/bin/bash

bash apps/api/database/hasura/close.sh

echo "Creating okampus-hasura..." && . apps/api/.env 2>/dev/null && docker run $@ --name okampus-hasura --net=host \
-e HASURA_GRAPHQL_ADMIN_SECRET=${HASURA_GRAPHQL_ADMIN_SECRET} \
-e HASURA_GRAPHQL_JWT_SECRET="{\"type\":\"${JWT_ALGORITHM}\",\"key\":\"${ACCESS_TOKEN_SECRET}\",\"header\":{\"type\":\"Cookie\",\"name\":\"OKAMPUS_ACCESS_TOKEN\"}}" \
-e HASURA_GRAPHQL_DATABASE_URL=postgres://${PSQL_USERNAME}:${PSQL_PASSWORD}@${PSQL_HOST}:5432/${PSQL_DATABASE} \
-e HASURA_INPUT_VALIDATION_WEBHOOK_URL=${HASURA_INPUT_VALIDATION_WEBHOOK_URL} \
-e HASURA_GRAPHQL_EXPERIMENTAL_FEATURES=naming_convention \
-e HASURA_GRAPHQL_DEFAULT_NAMING_CONVENTION=graphql-default \
-e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
-e HASURA_GRAPHQL_UNAUTHORIZED_ROLE=anonymous \
-e HASURA_GRAPHQL_DEV_MODE=true \
-e HASURA_GRAPHQL_STRINGIFY_NUMERIC_TYPES=true \
hasura/graphql-engine:v2.30.0 | pnpm pino-pretty -c -t