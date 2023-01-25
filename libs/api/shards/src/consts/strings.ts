import { ClassGroupType } from '@okampus/shared/enums';

export const classes = [
  {
    slug: 'everyone',
    name: 'Tout le monde',
    description: 'Groupe commun à tous les étudiants 🚀',
    parentId: null,
    type: ClassGroupType.All,
  },
  {
    slug: 'program-test',
    name: 'PGE',
    description: 'Programme étudiant "Test"',
    parentId: 'everyone',
    type: ClassGroupType.Program,
  },
  {
    slug: 'year-test',
    name: 'Année Test',
    description: 'Année étudiante "Test" du programme étudiant "Test"',
    parentId: 'program-test',
    type: ClassGroupType.Year,
  },
  {
    slug: 'sector-test',
    name: 'Filière Test',
    description: 'Filière "Test" de l\'année étudiante "Test"',
    parentId: 'year-test',
    type: ClassGroupType.Sector,
  },
  {
    slug: 'group-test',
    name: 'Groupe Test',
    description: 'Groupe étudiant "Test" de l\'année étudiante "Test"',
    parentId: 'sector-test',
    type: ClassGroupType.Class,
  },
];

export const iCals = {
  globalName: 'Tous les événements publics',
  personnalName: 'Évènements associatifs pour {0}',
};

export const scopeString = '@';

export const clubString = 'vie-asso';

export const groupTypeIcons = {
  clubs: '🎉',
  [ClassGroupType.All]: '🏫',
  [ClassGroupType.Program]: '💻',
  [ClassGroupType.Year]: '🎓',
  [ClassGroupType.Sector]: '📚',
  [ClassGroupType.Class]: '📒',
};
