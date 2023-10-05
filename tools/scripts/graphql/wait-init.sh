until nc -z -w5 $HASURA_HOST 8080; do
  echo "Waiting for hasura to be up..."
  sleep 1
done

sh ./tools/scripts/graphql/init.sh
