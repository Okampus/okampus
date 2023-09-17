# Run the project locally

## Requirements

- [Docker][docker]
- [Docker Compose][docker compose]
- [Node.js][node.js] (v18 or higher)
- [PNPM][pnpm]

## Running

1. Clone the repository
1. Run `pnpm install` in the root directory
1. Duplicate `.env.dev.example` and rename it to `.env.dev`
1. Duplicate `apps/api/.env.example` and rename it to `apps/api/.env`
1. Fill the `.env.dev` file with the required information. If you only run this project locally, the default values should be fine.
1. Run `pnpm run docker:dev` in the root directory
1. Create your S3 access keys:
   1. Go to `http://localhost:9001`
   1. Log in with the credentials you set in the `.env.dev` file
   1. Go to "Access Keys" (sidebar)
   1. Click "Create access key" and then "Create"
   1. Copy the access keys from the popup and paste them in `apps/api/.env` for `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY`
1. Fill the `apps/api/.env` file with the required information.
   1. Create all the necessary secrets (`HASURA_JWT_SECRET`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `WS_TOKEN_SECRET`, `HASURA_ADMIN_SECRET`, `BOT_TOKEN_SECRET`, `COOKIE_SIGNATURE_SECRET`, `PEPPER_SECRET`, `SESSION_SECRET`)
   1. Update the `PSQL_*` information with the ones defined in the `.env.dev` file
   1. To create initial data, set `ORM_SEEDING_ENABLED` to `true` (keep `ORM_SEEDING_BUCKET` empty)
   1. Update the `REDIS_*` information with the ones defined in the `.env.dev` file
   1. Update the `MEILISEARCH_*` information with the ones defined in the `.env.dev` file
   1. Keep the defaults values for the optional services (`SENTRY_*`, `GEOAPIFY_API_KEY`, `GOOGLE_CUSTOM_SEARCH_API_KEY`, `INSEE_API_KEY`, `NOVU_*`)
   1. Update the `S3_*` information with the ones defined in the `.env.dev` file. If using MinIO, keep `S3_FORCE_PATH_STYLE` to `true`
1. Be careful to have the following variable match between `.env.dev` and `apps/api/.env`: `HASURA_GRAPHQL_ADMIN_SECRET`, `HASURA_INPUT_VALIDATION_WEBHOOK_URL`, the `JWT_ALGORITHM` and the `ACCESS_TOKEN_SECRET` used in `HASURA_GRAPHQL_JWT_SECRET` (respectively for fields `type` and `key`).
1. Create your MinIO buckets:
   1. Go to `http://localhost:9001`
   1. Log in with the credentials you set in the `.env.dev` file
   1. Go to "Buckets" (sidebar)
   1. For each value for the `S3_BUCKET_NAME_*` environment variables, click "Create bucket" and name it to the value defined for that environment variable. Then click on the bucket to configure it, and on the "Anonymous" tab, click "Add access Rule", and add a `readonly` rule for the `/` prefix.
1. Run `pnpm run tools:refresh-db` in the root directory
1. Run `pnpm nx run api:serve` in the root directory
1. In a new terminal, run `pnpm nx run site:serve` in the root directory. If you want to start the site in production mode to avoid slow loads, run `pnpm nx run site:build`, then `cd` into `dist/apps/site` and run `npx next start`.
1. The API should be healthy (`http://localhost:8081/health`) and the site should be available at `http://localhost:3000`. You can monitor the various services with their web UIs, Meilisearch is available at `http://localhost:7700`, MinIO at `http://localhost:9001`, redis (redisinsights) at `http://localhost:6363`, and postgres (pgadmin) at `http://localhost:3030`.

## Updating

If when you pull there has been significant changes to the databases, you should run `pnpm run tools:refresh-db` to update the database schemas.\
You should also think about updating the dependencies with `pnpm i`.

<!-- Links -->

[docker]: https://docs.docker.com/install/
[docker compose]: https://docs.docker.com/compose/install/
[node.js]: https://nodejs.org/en/download/
[pnpm]: https://pnpm.io/installation
