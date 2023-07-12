// TODO: redo this whole file + translate it to English

# Contribuer

## Directives

**Les issues sont uniquement pour signaler des bugs ou proposer des suggestions. Si vous avez une question concernant le site ou son développement, ouvrez une Discussion GitHub**.

Pour contribuer à ce repo, n'hésitez pas à créer un nouveau fork et à soumettre une Pull Request, en suivant ces instructions :

1. Si possible, ouvrez en amont une issue pour s'assurer que c'est un problème que l'équipe souhaite résoudre, qui n'est pas déjà en train d'être travaillé, et afin de documenter votre travail et de pouvoir vous donner des suggestions et des conseils.
1. Forkez, clonez, et selectionnez la branche `dev`.
   `git clone https://github.com/<votre pseudo>/okampus`
1. **Créez une nouvelle branche sur votre fork.**
   `git checkout -b feature/<votre-feature>`
1. Faites vos changements dans le code
1. Assurez-vous que le lint passe avec `npm run lint`.
1. **Pensez-bien à tester vos changements de manière intensive.**
1. Commitez vos changements avec des commits le plus possible organisés et clairs, puis pushez-les.
   Veillez à suivre le style "[conventional commits](https://conventionalcommits.org/)" pour les noms de vos commits.
   `git add <fichiers modifiés>` puis `git commit -m "<description>"` puis `git push origin <votre branche>`
1. Soumettez une Pull Request! Assurez-vous que votre PR fait bien un changement dans un domaine précis : 1 PR = 1 changement (n'ajoutez pas 3 endpoints et 4 bugfixes en une seule PR).

⚠️ Utilisez l'anglais pour vos commits, les commentaires dans votre code, les messages de logs dans la console, les variables et tout autre objet compris directement dans le code.\

Les messages visibles par les utilisateurs sur le frontend, votre PR, vos issues etc. doivent être en **français**.

<!-- Link Dump -->

[node.js]: https://nodejs.org/en/download/
[le readme du backend]: ./apps/api/README.md
[le readme du frontend]: ./apps/site/README.md
