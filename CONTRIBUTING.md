# Contribuer

## Préambule

N'ayez pas peur de contribuer ! Ce n'est pas grave si vous faites une erreur, on est là pour apprendre ! Le principe
d'une Pull Request est justement de pouvoir s'améliorer mutuellement et de faire évoluer le code ensemble. Si vous avez
un doute, créez votre PR quand même en faisant part de votre doute dans le message, ou créez une discussion GitHub.\
Sur votre PR, n'ayez pas peur de faire autant de commits dont vous avez besoin, ils seront de toute façon squash
(= réunis) en un seul commit avant de merge.

## Directives

**Les issues sont uniquement pour signaler des bugs ou proposer des suggestions. Si vous avez une question concernant
le bot ou son développement, ouvrez une Discussion GitHub**.

Pour contribuer à ce repo, n'hésitez pas à créer un nouveau fork et à soumettre une Pull Request, en suivant ces
instructions :

1. Forkez, clonez, et selectionnez la branche `master`.
   `git clone https://github.com/<votre pseudo>/HorizonWeb`
1. **Créez une nouvelle branche sur votre fork.**
   `git checkout -b feature-<votre feature>`
1. Faites vos changements.
1. Assurez-vous que le lint passe avec `npm run lint`.
1. Pensez-bien à tester vos changements de manière **intensive**.
1. Commitez vos changements avec des commits le plus possible organisés et clairs, puis pushez-les.
   `git add <fichiers modifiés>` puis `git commit -m "<description>"` puis `git push origin <votre branche>`
1. Soumettez une Pull Request! Assurez-vous que votre PR fait bien un changement dans un domaine précis : 1 PR = 1
changement (ne faites pas 3 commandes et 4 bugfixes en une seule PR).

⚠️ Utilisez l'anglais pour vos commits, les commentaires dans votre code, les messages de logs dans la console, les
variables et tout autre objet compris directement dans le code.\
Les messages visibles par les utilisateurs sur le frontend, votre PR, vos issues etc. doivent être en **français**.

## Lancer HorizonWeb localement

Pour lancer HorizonWeb localement, il faut suivre ces étapes :

1. Installez [Node.js]. Vérifiez bien d'avoir Node.js v16+ ou plus quand vous faites `node -v`.

### Pour le Backend

1. Installez [MongoDB Community Edition].
1. Dupliquez puis renommez le fichier `.env.example` dans le dossier `api/`, en `.env`.
1. Remplissez ce fichier avec vos tokens et votre configuration.
1. Installez les dependences avec `npm install`.
1. Lancez l'API en mode "développement" avec `npm run dev`.

### Pour le Frontend

1. Installez les dependences avec `npm install`.
1. Lancez HorizonWeb en mode "développement" avec `npm run dev`.

### D'autres commandes importantes

```bash
# Lancer les tests de style de code ('lint')
$ npm run lint
# Appliquer automatiquement les règles de style de code
$ npm run lint:fix
# Lancer le front ou le back en mode de développement
$ npm run dev
# Lancer le front ou le back en mode de production
$ npm start
```

<!-- Link Dump -->

[Node.js]: https://nodejs.org/en/download/
[MongoDB Community Edition]: https://docs.mongodb.com/manual/installation/
