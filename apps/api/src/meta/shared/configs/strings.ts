import { ClassType } from '../lib/types/enums/class-type.enum';

export const schoolGroups = [
  {
    id: 'everyone',
    name: 'Tout le monde',
    description: 'Groupe commun à tous les étudiants 🚀',
    parentId: null,
    type: ClassType.Everyone,
  },
  {
    id: 'program-test',
    name: 'PGE',
    description: 'Programme étudiant "Test"',
    parentId: 'everyone',
    type: ClassType.Program,
  },
  {
    id: 'year-test',
    name: 'Année Test',
    description: 'Année étudiante "Test" du programme étudiant "Test"',
    parentId: 'program-test',
    type: ClassType.Year,
  },
  {
    id: 'sector-test',
    name: 'Filière Test',
    description: 'Filière "Test" de l\'année étudiante "Test"',
    parentId: 'year-test',
    type: ClassType.Sector,
  },
  {
    id: 'group-test',
    name: 'Groupe Test',
    description: 'Groupe étudiant "Test" de l\'année étudiante "Test"',
    parentId: 'sector-test',
    type: ClassType.Class,
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
  [ClassType.Everyone]: '🏫',
  [ClassType.Program]: '💻',
  [ClassType.Year]: '🎓',
  [ClassType.Sector]: '📚',
  [ClassType.Class]: '📒',
};
