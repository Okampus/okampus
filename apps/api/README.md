<h1 align="center">Okampus — API</h1>
<p align="center">
  Dépôt GitHub public de l'API d'Okampus
</p>

<h3 align="center">Backend & API</h1>

// TODO: Rewrite READMEs

## Lancer Okampus — API localement

Pour lancer l'API d'Okampus localement, il faut suivre ces étapes :

1. Installez [Node.js]. Vérifiez bien d'avoir Node.js v16+ ou plus quand vous faites `node -v`.
1. Dupliquez puis renommez le fichier `.env.example` dans le dossier `apps/api/`, en `.env`.
1. Remplissez ce fichier avec vos tokens et votre configuration. Pensez à bien remplir le nom d'utilisateur et mot de passe de votre base de données : les variables sont préfixées par `MIKRO_ORM_`. Si vous avez installé MeiliSearch, vous devez aussi remplir la variable `MEILISEARCH_MASTER_KEY` avec la clé d'api que vous avez définie en le lançant (avec meilisearch --master-key="&lt;votre clé&gt;").
1. Installez [PostgreSQL 14].
1. Installez [Redis 7].
1. Installez les dépendences avec `npm install`.
1. :warning: Initialisez la base de données PostgreSQL avec `npx mikro-orm migration:up`.
   Vous devrez probablement créer la base de données (vide) auparavant. Pensez à l'appeler comme vous l'avez configuré dans le fichier `.env` : `PSQL_DATABASE` (par défault, `okampus`). Avec `psql`, vous pouvez créer la base de données en lançant `psql -c "CREATE DATABASE IF NOT EXISTS okampus;"` dans votre terminal.
1. Lancez l'API en mode "développement" avec `npm run dev`.

## Lancer Okampus via Docker

Si vous préférez utiliser Docker, un container est disponible. Il vous suffit de le lancer avec `docker-compose up` à la racine du projet.

## Commandes importantes

```bash
# Lancer l'API en mode de développement
$ npm run dev
# Lancer l'API en mode de production
$ npm start
# Lancer les tests de style de code ('lint')
$ npm run lint
# Appliquer automatiquement les règles de style de code
$ npm run lint:fix
# Migrer la base de données à la dernière version
$ npx mikro-orm migration:up
```

<!-- Link Dump -->

[node.js]: https://nodejs.org/en/download/
[postgresql 14]: https://www.postgresqltutorial.com/postgresql-getting-started/
[redis 7]: https://redis.io/download/
[meilisearch]: https://docs.meilisearch.com/learn/getting_started/quick_start.html
