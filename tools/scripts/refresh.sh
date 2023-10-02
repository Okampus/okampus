#!/bin/bash

pnpm run tools:db:migrate:dev
pnpm run tools:db:seed
pnpm nx run site:hasura:metadata:apply
pnpm nx run site:graphql:merge
pnpm nx run shared-graphql:codegen
