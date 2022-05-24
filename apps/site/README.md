<h1 align="center">Okampus — Site</h1>
<p align="center">
  Dépôt GitHub public du frontend d'Okampus
</p>

<h3 align="center">Frontend & Site</h1>

## Lancer Okampus — Site localement

Pour lancer le site d'Okampus localement, il faut suivre ces étapes :

1. Lancez l'API, en suivant [les instructions du backend].
1. Installez [Node.js]. Vérifiez bien d'avoir Node.js v16+ ou plus quand vous faites `node -v`.
1. Dupliquez puis renommez le fichier `.env.example` dans le dossier `apps/api/`, en `.env`.
1. Remplissez ce fichier avec vos tokens et votre configuration. Si vous avez installé Typesense dans le backend, vous devez aussi remplir la variable `VITE_TYPESENSE_API_KEY` avec la clé d'api que vous avez définie en le lançant. En théorie, cette clé doit être [une clé spéciale, de recherche uniquement]. Toutefois, pour vous faciliter le processsus de développement, vous pouvez utiliser la clé d'api admin.
1. Installez les dépendences avec `npm install`.
1. Lancez le site en mode "développement" avec `npm run dev`.

## Commandes importantes

```bash
# Lancer le site en mode de développement
$ npm run dev
# Lancer le site en mode de production
$ npm run build && npm run serve
# Lancer les tests de style de code ('lint')
$ npm run lint
# Appliquer automatiquement les règles de style de code
$ npm run format
```

<!-- Link Dump -->
[les instructions du backend]: ../api/README.md
[Node.js]: https://nodejs.org/en/download/
[une clé spéciale, de recherche uniquement]: https://typesense.org/docs/latest/api/api-keys.html#search-only-api-key
