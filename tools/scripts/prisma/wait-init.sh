until nc -z -w5 $PSQL_HOST $POSTGRES_PUBLISHED_PORT; do
  echo "Waiting for DB to be up..."
  sleep 1
done

echo ""
sh ./tools/scripts/prisma/migrate.sh
sh ./tools/scripts/prisma/seed.sh
