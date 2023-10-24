echo 'Initializing docker compose, please wait...'
pnpm docker:dev -d
echo ''
echo 'Docker compose is up!'
sh ./tools/scripts/s3/wait-init.sh
sh ./tools/scripts/prisma/wait-init.sh
sh ./tools/scripts/graphql/wait-init.sh
echo 'Docker compose initialized. Downing...'
pnpm docker:down
