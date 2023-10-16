hostname=$(echo $NEXT_PUBLIC_HASURA_FQDN | cut -d ':' -f 1)
port=$(echo $NEXT_PUBLIC_HASURA_FQDN | cut -d ':' -f 2)

until nc -z -w5 $hostname $port; do
  echo "Waiting for hasura to be up..."
  sleep 1
done

sh ./tools/scripts/graphql/init.sh
