# Run the project locally

## Requirements

- [Docker][docker]
- [Docker Compose][docker compose]
- [Node.js][node.js] (v18 or higher)
- [PNPM][pnpm]

## Running

1. Clone the repository
1. Run `pnpm install` in the root directory
1. Duplicate `./apps/site/.env.development` and rename it to `.env`
1. Fill the `.env` file with the required information. If you only run this project locally, the default values should be fine.
1. Run `pnpm run docker:dev` in the root directory
1. Create your MinIO buckets:
   1. Go to `http://localhost:19001`
   1. Log in with the credentials you set in the `.env` file
   1. Go to "Buckets" (sidebar)
   1. For each value for the `S3_BUCKET_NAME_*` environment variables, click "Create bucket" and name it to the value defined for that environment variable. Then click on the bucket to configure it, and on the "Anonymous" tab, click "Add access Rule", and add a `readonly` rule for the `/` prefix.
1. Run `pnpm run tools:refresh-db` in the root directory
1. Run `pnpm nx run api:serve` in the root directory
1. In a new terminal, run `pnpm nx run site:serve` in the root directory. If you want to start the site in production mode to avoid slow loads, run `pnpm nx run site:build`, then `cd` into `dist/apps/site` and run `npx next start`.
1. The API should be healthy (`http://localhost:8081/health`) and the site should be available at `http://localhost:3000`. You can monitor the various services with their web UIs, Meilisearch is available at `http://localhost:7700`, MinIO at `http://localhost:19001`, redis (redisinsights) at `http://localhost:6363`, and postgres (pgadmin) at `http://localhost:3030`.

## Updating

If when you pull there has been significant changes to the databases, you should run `pnpm run tools:refresh-db` to update the database schemas.\
You should also think about updating the dependencies with `pnpm i`.

<!-- Links -->

[docker]: https://docs.docker.com/install/
[docker compose]: https://docs.docker.com/compose/install/
[node.js]: https://nodejs.org/en/download/
[pnpm]: https://pnpm.io/installation
