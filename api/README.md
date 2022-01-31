<h1 align="center">HorizonWeb — API</h1>
<p align="center">
  🖥 Le projet de forum d'entraide étudiante de Horizon !
</p>

<h3 align="center">Backend & API</h1>

## Lancer HorizonWeb — API localement

Pour lancer l'API d'HorizonWeb localement, il faut suivre ces étapes :

1. Installez [Node.js]. Vérifiez bien d'avoir Node.js v16+ ou plus quand vous faites `node -v`.
1. Installez [PostgreSQL 14].
1. (Optionel) Installez [Typesense] et démarrez-le avec les drapeaux `--data-dir=/tmp/typesense-data` et `--api-key=votre_clé_dapi`.
1. Dupliquez puis renommez le fichier `.env.example` dans le dossier `api/`, en `.env`.
1. Remplissez ce fichier avec vos tokens et votre configuration. Pensez à bien remplir le nom d'utilisateur et mot de passe de votre base de données : les variables sont préfixées par `MIKRO_ORM_`. Si vous avez installé Typesense, vous devez aussi remplir la variable `TYPESENSE_API_KEY` avec la clé d'api que vous avez définie en le lançant.
1. Installez les dépendences avec `npm install`.
1. :warning: Initialisez la base de données postgreSQL avec `npx mikro-orm schema:create -r`
1. Lancez l'API en mode "développement" avec `npm run dev`.

## Lancer HorizonWeb via Docker

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
```

<!-- Link Dump -->
[Node.js]: https://nodejs.org/en/download/
[PostgreSQL 14]: https://www.postgresqltutorial.com/postgresql-getting-started/
[Typesense]: https://typesense.org/docs/guide/install-typesense.html#📥-download-install
