<h1 align="center">HorizonWeb — API</h1>
<p align="center">
  🖥 Le projet de forum d'entraide étudiante de Horizon !
</p>

<h3 align="center">Backend & API</h1>

## Lancer HorizonWeb — API localement

Pour lancer l'API d'HorizonWeb localement, il faut suivre ces étapes :

1. Installez [Node.js]. Vérifiez bien d'avoir Node.js v16+ ou plus quand vous faites `node -v`.
1. Installez [PostgreSQL 13].
1. Dupliquez puis renommez le fichier `.env.example` dans le dossier `api/`, en `.env`.
1. Remplissez ce fichier avec vos tokens et votre configuration.
1. Installez les dependences avec `npm install`.
1. :warning: Initialisez la base de données postgreSQL avec `npx mikro-orm schema:create -r`
1. Lancez l'API en mode "développement" avec `npm run dev`.

## Lancer HorizonWeb via Docker

Si vous préférez utiliser Docker, un container est disponible. Il vous suffit de le lancer avec `docker-compose up` à la racine du projet.

## Commandes importantes

```bash
# Lancer les tests de style de code ('lint')
$ npm run lint
# Appliquer automatiquement les règles de style de code
$ npm run lint:fix
# Lancer l'API en mode de développement
$ npm run dev
# Lancer l'API en mode de production
$ npm start
```

<!-- Link Dump -->
[Node.js]: https://nodejs.org/en/download/
[PostgreSQL 13]: https://www.postgresqltutorial.com/postgresql-getting-started/
