#!/bin/bash

# Declare an associative array of namespace
declare -A kubernetes_namespace

# Populate the associative array with key-value pairs
kubernetes_namespace[default]=production
kubernetes_namespace[preprod]=development

# Get env from vercel
json_data=$(curl -X GET "https://api.vercel.com/v7/projects/$VERCEL_PROJECT_ID/env?decrypt=true&source=vercel-cli:pull&teamId=$VERCEL_TEAM_ID" -H "Authorization: Bearer $VERCEL_ACCESS_TOKEN")
processed=$(echo $json_data | grep -Poh "\"envs\":\[(.*)\]")
envs=(${processed//"},{"/ })
namespace="${kubernetes_namespace[$NAMESPACE]}"

echo $json_data

declare -A env_map
for env in "${envs[@]}"
do
  found=$(echo "$env" | grep "\"target\":\[.*\"$namespace\".*\]")
  if [ ! -z "$found" ]; then
    key=$(echo "$env" | grep -oh "\"key\":\"[^\"]*\"" | sed -e 's/"key":"//g' -e 's/"//g')
    value=$(echo "$env" | grep -oh "\"value\":\"[^\"]*\"" | sed -e 's/"value":"//g' -e 's/"//g')
    env_map[$key]=$value
  fi
done

export HASURA_GRAPHQL_DATABASE_URL=postgres://${env_map["PSQL_USER"]}:${env_map["PSQL_PASSWORD"]}@${env_map["PSQL_HOST"]}:${env_map["POSTGRES_PUBLISHED_PORT"]}/${env_map["POSTGRES_DB"]}
export HASURA_GRAPHQL_JWT_SECRET=\{\"type\":\"${env_map["JWT_ALGORITHM"]}\",\"key\":\"${env_map["ACCESS_TOKEN_SECRET"]}\",\"claims_namespace\":\"https://hasura.io/jwt/claims\",\"claims_format\":\"json\",\"header\":\{\"type\":\"Cookie\",\"name\":\"OKAMPUS_ACCESS_TOKEN\"\}\}
export HASURA_GRAPHQL_ADMIN_SECRET=${env_map["HASURA_GRAPHQL_ADMIN_SECRET"]}
export HASURA_INPUT_VALIDATION_WEBHOOK_URL=${env_map["HASURA_INPUT_VALIDATION_WEBHOOK_URL"]}

unset VERCEL_ACCESS_TOKEN
unset VERCEL_PROJECT_ID
unset VERCEL_TEAM_ID

printenv

/bin/graphql-engine serve