#!/bin/bash

pnpm nx run site:hasura:metadata:apply
pnpm nx run site:graphql:merge
pnpm nx run shared-graphql:codegen
