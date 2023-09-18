#!/bin/sh

psql -U postgres
psql --command "CREATE USER \"$PSQL_USER\" WITH PASSWORD '$PSQL_PASSWORD';"
psql --command "CREATE DATABASE \"$PSQL_DB\";"
psql --command "GRANT ALL PRIVILEGES ON DATABASE \"$PSQL_DB\" to \"$PSQL_USER\";"
