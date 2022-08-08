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
2. Remplissez ce fichier avec vos tokens et votre configuration.
3. Installez les dépendences avec `npm install`.
4. Lancez le site en mode "développement" avec `npm run dev`.

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
