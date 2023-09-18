#!/bin/sh

psql -U postgres
psql --command "CREATE USER \"$PSQL_USER\" WITH PASSWORD '$PSQL_PASSWORD';"
psql --command "GRANT ALL PRIVILEGES ON DATABASE \"$POSTGRES_DB\" to \"$PSQL_USER\";"
psql --command "ALTER USER \"$PSQL_USER\" WITH SUPERUSER;"
