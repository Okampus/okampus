# Contribuer

## Préambule

N'ayez pas peur de contribuer ! Ce n'est pas grave si vous faites une erreur, on est là pour apprendre ! Le principe d'une Pull Request est justement de pouvoir s'améliorer mutuellement et de faire évoluer le code ensemble. Si vous avez un doute, créez votre PR quand même en faisant part de votre doute dans le message, ou créez une discussion GitHub.\
Sur votre PR, n'ayez pas peur de faire autant de commits dont vous avez besoin, ils seront de toute façon squash (= réunis) en un seul commit avant de merge.

## Directives

**Les issues sont uniquement pour signaler des bugs ou proposer des suggestions. Si vous avez une question concernant le site ou son développement, ouvrez une Discussion GitHub**.

Pour contribuer à ce repo, n'hésitez pas à créer un nouveau fork et à soumettre une Pull Request, en suivant ces instructions :

1. Forkez, clonez, et selectionnez la branche `dev`.
   `git clone https://github.com/<votre pseudo>/HorizonWeb`
1. **Créez une nouvelle branche sur votre fork.**
   `git checkout -b feature/<votre-feature>`
1. Faites vos changements.
1. Assurez-vous que le lint passe avec `npm run lint`.
1. Pensez-bien à tester vos changements de manière **intensive**.
1. Commitez vos changements avec des commits le plus possible organisés et clairs, puis pushez-les.
   `git add <fichiers modifiés>` puis `git commit -m "<description>"` puis `git push origin <votre branche>`
1. Soumettez une Pull Request! Assurez-vous que votre PR fait bien un changement dans un domaine précis : 1 PR = 1 changement (n'ajoutez pas 3 endpoints et 4 bugfixes en une seule PR).

⚠️ Utilisez l'anglais pour vos commits, les commentaires dans votre code, les messages de logs dans la console, les variables et tout autre objet compris directement dans le code.\
Les messages visibles par les utilisateurs sur le frontend, votre PR, vos issues etc. doivent être en **français**.

## Lancer HorizonWeb localement

Pour lancer HorizonWeb localement, il faut suivre ces étapes :

- Pour le backend : voir les instructions sur [le README du backend].
- Pour le frontend : voir les instructions sur [le README du frontend].

### Via Docker

Si vous préférez utiliser Docker, un container est disponible. Il vous suffit de le lancer avec `docker-compose up` à la racine du projet.

<!-- Link Dump -->

[Node.js]: https://nodejs.org/en/download/
[le README du backend]: ./apps/api/README.md
[le README du frontend]: ./apps/site/README.md
