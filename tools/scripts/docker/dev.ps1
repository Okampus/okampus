if (-not (Test-Path -Path "apps\site\.env" -PathType Leaf)) {
    New-Item -Path "apps\site\.env" -ItemType File
}

docker compose --file docker-compose.dev.yml --env-file ./apps/site/.env.development --env-file ./apps/site/.env up;
