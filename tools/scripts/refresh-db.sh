#!/bin/bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Load environment variables from .env file
ENV_FILE="$SCRIPT_DIR/../../apps/api/.env"
if [ -f "$ENV_FILE" ]; then
  source "$ENV_FILE"
else
  echo "Error: $ENV_FILE not found."
  exit 1
fi

CONTAINER_ID=`docker ps -f name=postgres -q`
docker exec -it $CONTAINER_ID dropdb -U "$PSQL_USERNAME" "$PSQL_DATABASE" -f
docker exec -it $CONTAINER_ID createdb -U "$PSQL_USERNAME" "$PSQL_DATABASE"

pnpm nx run api:migration:up

# Restart Hasura container to regenerate metadata (hdb_catalog).
docker compose -f "$SCRIPT_DIR/../../docker-compose.dev.yml" --env-file "$SCRIPT_DIR/../../.env.dev" restart hasura

pnpm nx run api:hasura:metadata:apply
pnpm nx run shared-graphql:codegen
