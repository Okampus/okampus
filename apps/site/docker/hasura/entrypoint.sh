#!/bin/bash

if [ -z "$VERCEL_ACCESS_TOKEN" ]; then echo 'Environment variable VERCEL_ACCESS_TOKEN must be specified. Exiting.'; exit 1; fi
if [ -z "$VERCEL_PROJECT_ID" ]; then echo 'Environment variable VERCEL_PROJECT_ID must be specified. Exiting.'; exit 1; fi
if [ -z "$VERCEL_TEAM_ID" ]; then echo 'Environment variable VERCEL_TEAM_ID must be specified. Exiting.'; exit 1; fi
if [ -z "$NAMESPACE" ]; then echo 'Environment variable NAMESPACE must be specified. Exiting.'; exit 1; fi
if [ "$NAMESPACE" != "default" ] && [ "$NAMESPACE" != "preprod" ]; then echo 'Environment variable NAMESPACE must be either default or preprod. Exiting.'; exit 1; fi

# Declare an associative array of namespace
declare -A kubernetes_namespace

# Populate the associative array with key-value pairs
kubernetes_namespace[default]=production
kubernetes_namespace[preprod]=development

# Get env from vercel
json_data=$(curl -X GET "https://api.vercel.com/v7/projects/$VERCEL_PROJECT_ID/env?decrypt=true&source=vercel-cli:pull&teamId=$VERCEL_TEAM_ID" -H "Authorization: Bearer $VERCEL_ACCESS_TOKEN")

# If json_data contains "Project not found", exit
if [[ $json_data == *"Project not found"* ]]; then echo "VERCEL_PROJECT_ID is incorrect: Project not found. Exiting."; exit 1; fi
if [[ $json_data == *"Not authorized"* ]]; then echo "VERCEL_ACCESS_TOKEN or VERCEL_TEAM_ID is incorrect: Not authorized. Exiting."; exit 1; fi

processed=$(echo $json_data | grep -Poh "\"envs\":\[(.*)\]") # get the envs array
envs=(${processed//"},{"/ }) # split by "},{"
namespace="${kubernetes_namespace[$NAMESPACE]}" # get the namespace from associative array

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

if [ -z "${env_map["PSQL_USER"]}" ]; then echo 'Environment variable PSQL_USER must be set in Vercel. Exiting.'; exit 1; fi
if [ -z "${env_map["PSQL_PASSWORD"]}" ]; then echo 'Environment variable PSQL_PASSWORD must be set in Vercel. Exiting.'; exit 1; fi
if [ -z "${env_map["PSQL_HOST"]}" ]; then echo 'Environment variable PSQL_HOST must be set in Vercel. Exiting.'; exit 1; fi
if [ -z "${env_map["POSTGRES_PUBLISHED_PORT"]}" ]; then echo 'Environment variable POSTGRES_PUBLISHED_PORT must be set in Vercel. Exiting.'; exit 1; fi
if [ -z "${env_map["POSTGRES_DB"]}" ]; then echo 'Environment variable POSTGRES_DB must be set in Vercel. Exiting.'; exit 1; fi
if [ -z "${env_map["JWT_ALGORITHM"]}" ]; then echo 'Environment variable JWT_ALGORITHM must be set in Vercel. Exiting.'; exit 1; fi
if [ -z "${env_map["ACCESS_TOKEN_SECRET"]}" ]; then echo 'Environment variable ACCESS_TOKEN_SECRET must be set in Vercel. Exiting.'; exit 1; fi
if [ -z "${env_map["HASURA_GRAPHQL_ADMIN_SECRET"]}" ]; then echo 'Environment variable HASURA_GRAPHQL_ADMIN_SECRET must be set in Vercel. Exiting.'; exit 1; fi
if [ -z "${env_map["HASURA_INPUT_VALIDATION_WEBHOOK_URL"]}" ]; then echo 'Environment variable HASURA_INPUT_VALIDATION_WEBHOOK_URL must be set in Vercel. Exiting.'; exit 1; fi

export HASURA_GRAPHQL_DATABASE_URL=postgres://${env_map["PSQL_USER"]}:${env_map["PSQL_PASSWORD"]}@${env_map["PSQL_HOST"]}:${env_map["POSTGRES_PUBLISHED_PORT"]}/${env_map["POSTGRES_DB"]}
export HASURA_GRAPHQL_JWT_SECRET=\{\"type\":\"${env_map["JWT_ALGORITHM"]}\",\"key\":\"${env_map["ACCESS_TOKEN_SECRET"]}\",\"claims_namespace\":\"https://hasura.io/jwt/claims\",\"claims_format\":\"json\",\"header\":\{\"type\":\"Cookie\",\"name\":\"OKAMPUS_ACCESS_TOKEN\"\}\}
export HASURA_GRAPHQL_ADMIN_SECRET=${env_map["HASURA_GRAPHQL_ADMIN_SECRET"]}
export HASURA_INPUT_VALIDATION_WEBHOOK_URL=${env_map["HASURA_INPUT_VALIDATION_WEBHOOK_URL"]}

unset VERCEL_ACCESS_TOKEN
unset VERCEL_PROJECT_ID
unset VERCEL_TEAM_ID

/bin/graphql-engine serve