export const schoolGroups = [
  {
    id: 'everyone',
    name: 'Tout le monde',
    description: 'Groupe commun à tous les étudiants 🚀',
    parentId: null,
    type: 0,
  },
  {
    id: 'program-test',
    name: 'PGE',
    description: 'Programme étudiant "Test"',
    parentId: 'everyone',
    type: 1,
  },
  {
    id: 'year-test',
    name: 'Année Test',
    description: 'Année étudiante "Test" du programme étudiant "Test"',
    parentId: 'program-test',
    type: 2,
  },
  {
    id: 'sector-test',
    name: 'Filière Test',
    description: 'Filière "Test" de l\'année étudiante "Test"',
    parentId: 'year-test',
    type: 3,
  },
  {
    id: 'group-test',
    name: 'Groupe Test',
    description: 'Groupe étudiant "Test" de l\'année étudiante "Test"',
    parentId: 'sector-test',
    type: 4,
  },
];

export const iCals = {
  globalName: 'Tous les événements publics',
  personnalName: 'Évènements associatifs pour {0}',
};
