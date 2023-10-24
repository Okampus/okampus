#!/bin/bash

pnpm nx run site:hasura:metadata:apply
pnpm nx run site:graphql:codegen
pnpm nx run shared-graphql:codegen
