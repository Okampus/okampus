import { ControlType } from '@okampus/shared/enums';
import { Colors, TeamRoleType, TenantRoleType } from '@prisma/client';

export const N_DEFAULT_CAMPUS = 3;

export const N_DEFAULT_BANKS = 10;
export const N_DEFAULT_LEGAL_UNITS = 50;
export const N_DEFAULT_TEAMS = 10;

export const DEFAULT_ADDRESSES = [
  '513c1028dc47b4024059f44421133a6e4840f00101f90122ad720000000000c0020192030d4c6f75767265204d757365756d', // Louvre
  '51300cf851225b024059ae3a6178db6d4840f00102f901747f4c0000000000c0020192030c45696666656c20546f776572', // Eiffel Tower
  '516596f37b51710240596b20a7f9746f4840f00103f9018bab390e01000000c002019203104368616d707320c3896c7973c3a96573', // Champs Elysees
  '5147f3b688ded8024059d7e484645c6a4840f00103f901807b070e00000000c0020192030e506c6163652064274974616c6965', // Place d'Italie
  '51646a504c2ba50240590cf038a080654840f00102f90174af600a00000000c0020192031053746164652045535450205061726973', // Stade ESTP Paris
];
export const DEFAULT_CAMPUS_CLUSTERS = ['Paris', 'Lyon', 'Bordeaux'];

export const DEFAULT_TEAM_JOIN_FORM_SCHEMA = [
  {
    name: 'motivation',
    type: ControlType.Text,
    label: "Quelle est votre motivation pour rejoindre l'équipe ?",
    placeholder: '',
    required: true,
  },
];
export const DEFAULT_EVENT_JOIN_FORM_SCHEMA = [
  {
    type: ControlType.Checkbox,
    name: 'payed',
    label:
      "Avez-vous payé votre billet via le lien dans la description de l'événement ? Votre inscription ne pourra pas être validée sinon.",
    placeholder: '',
    required: true,
  },
];

export const DEFAULT_CATEGORIES = {
  sport: 'Sport',
  culture: 'Culture',
  activities: 'Loisirs',
  games: 'Jeux',
  art: 'Art',
  tech: 'Technologie',
  international: 'International',
  pro: 'Professionnel',
};

export type DefaultCategories = (typeof DEFAULT_CATEGORIES)[keyof typeof DEFAULT_CATEGORIES];
export const DEFAULT_EVENT_NAMES_BY_CATEGORY: Record<DefaultCategories, string[]> = {
  Sport: [
    'Tournoi de quartier',
    'Séance de fitness en plein air',
    'Course de charité',
    'Match amical',
    'Championnat local',
    'Rallye sportif',
    'Journée du sport en famille',
    'Tournoi de basket 3x3',
    'Marathon communautaire',
    'Rencontre sportive informelle',
  ],
  Culture: [
    'Exposition artistique locale',
    'Projection de films indépendants',
    'Soirée poésie',
    'Lecture publique',
    'Spectacle de théâtre amateur',
    'Festival de danse contemporaine',
    "Atelier d'art participatif",
    'Carnaval des arts',
    'Soirée de musique live',
    'Séance club de lecture',
  ],
  Loisirs: [
    'Picnic dans le parc',
    'Randonnée en nature',
    'Atelier de bricolage',
    'Concours de barbecue',
    'Balade à vélo en groupe',
    'Chasse au trésor pour les familles',
    'Soirée jeux de société',
    'Journée de pêche au bord du lac',
    'Festival de cinéma en plein air',
    'Cours de cuisine communautaire',
  ],
  Jeux: [
    'Tournoi de jeux de société',
    'Soirée jeux de cartes',
    'Challenge de jeux vidéo',
    'Concours de puzzles',
    'Jeu de rôle en extérieur',
    'Rencontre de gamers locaux',
    'Olympiades ludiques',
    'Tournoi de fléchettes',
    'Jeu de quiz en équipe',
    'Soirée poker entre amis',
  ],
  Art: [
    "Exposition d'art contemporain",
    "Vernissage d'artiste local",
    'Atelier de peinture en plein air',
    'Sculpture collective',
    'Spectacle de théâtre amateur',
    'Concert acoustique intime',
    'Cours de photographie',
    'Atelier de poterie',
    'Balade artistique dans la ville',
    "Galerie d'art éphémère",
  ],
  Technologie: [
    'Salon des startups',
    'Hackathon communautaire',
    'Conférence sur les nouvelles technologies',
    'Atelier de programmation',
    'Journée de la robotique',
    'Séminaire sur la cybersécurité',
    "Festival de l'innovation",
    'Rencontre des passionnés de tech',
    'Concours de codage',
    'Exposition de gadgets électroniques',
  ],
  International: [
    'Festival de la diversité culturelle',
    'Semaine des cultures du monde',
    'Journée des échanges internationaux',
    'Exposition multiculturelle',
    'Conférence diplomatique',
    'Fête des nations',
    'Festival de la paix mondiale',
    'Séminaire sur les affaires mondiales',
    'Atelier de langues étrangères',
    'Conférence sur la coopération internationale',
  ],
  Professionnel: [
    'Conférence sur la gestion de carrière',
    'Atelier de développement personnel',
    'Séminaire de leadership local',
    "Table ronde sur l'entreprenariat",
    'Journée de réseautage professionnel',
    "Forum local de l'emploi",
    'Salon de la formation continue',
    'Rencontre des entrepreneurs du coin',
    'Workshop sur les compétences en communication',
    "Café carrière et conseils d'emploi",
  ],
};

export const DEFAULT_USER_PASSWORD = 'password';

export const N_DEFAULT_TENANT_ADMINS = 10;
export const N_DEFAULT_TENANT_MEMBERS = 2000;

export const N_DEFAULT_MIN_TEAM_MEMBERS = 1;
export const N_DEFAULT_MAX_TEAM_MEMBERS = 20;

export const N_DEFAULT_MIN_TEAM_JOINS = 1;
export const N_DEFAULT_MAX_TEAM_JOINS = 10;

export const N_DEFAULT_MIN_MISSION_QUANTITY = 1;
export const N_DEFAULT_MAX_MISSION_QUANTITY = 3;

export const N_DEFAULT_MIN_TEAM_PROJECTS = 1;
export const N_DEFAULT_MAX_TEAM_PROJECTS = 3;

export const N_DEFAULT_MIN_PROJECT_MISSIONS = 2;
export const N_DEFAULT_MAX_PROJECT_MISSIONS = 5;

export const N_DEFAULT_MIN_PROJECT_ACTIONS = 2;
export const N_DEFAULT_MAX_PROJECT_ACTIONS = 5;

export const N_DEFAULT_MIN_PROJECT_EVENTS = 1;
export const N_DEFAULT_MAX_PROJECT_EVENTS = 3;

export const N_DEFAULT_MIN_EVENT_MISSIONS = 1;
export const N_DEFAULT_MAX_EVENT_MISSIONS = 2;

export const N_DEFAULT_MIN_EVENT_ACTIONS = 1;
export const N_DEFAULT_MAX_EVENT_ACTIONS = 2;

export const N_DEFAULT_MIN_EVENT_JOINS = 2;
export const N_DEFAULT_MAX_EVENT_JOINS = 15;

export const DEFAULT_TEAM_ROLES = [
  {
    name: 'Membre',
    color: Colors.Blue,
    canViewJoins: true,
  },
  {
    name: 'Président',
    color: Colors.Green,
    canManageProfile: true,
    canViewTreasury: true,
    canManageTreasury: true,
    canViewJoins: true,
    canManageJoins: true,
    canManageDocuments: true,
    canManageMemberRoles: true,
    canManageRoles: true,
    canCreateEvents: true,
    canManageEvents: true,
    canViewDraftEvents: true,
    canCreateActions: true,
    canManageActions: true,
    canCreateContents: true,
    canManageContents: true,
    type: TeamRoleType.President,
  },
  {
    name: 'Trésorier',
    color: Colors.Green,
    canManageProfile: true,
    canViewTreasury: true,
    canManageTreasury: true,
    canViewJoins: true,
    canManageJoins: true,
    canManageDocuments: true,
    canManageMemberRoles: true,
    canManageRoles: true,
    canCreateEvents: true,
    canManageEvents: true,
    canViewDraftEvents: true,
    canCreateActions: true,
    canManageActions: true,
    canCreateContents: true,
    canManageContents: true,
    type: TeamRoleType.Treasurer,
  },
  {
    name: 'Secrétaire',
    color: Colors.Green,
    canManageProfile: true,
    canViewTreasury: true,
    canManageTreasury: true,
    canViewJoins: true,
    canManageJoins: true,
    canManageDocuments: true,
    canManageMemberRoles: true,
    canManageRoles: true,
    canCreateEvents: true,
    canManageEvents: true,
    canViewDraftEvents: true,
    canCreateActions: true,
    canManageActions: true,
    canCreateContents: true,
    canManageContents: true,
    type: TeamRoleType.Secretary,
  },
  {
    name: 'Événements',
    color: Colors.Red,
    canViewTreasury: true,
    canViewJoins: true,
    canCreateEvents: true,
    canManageEvents: true,
    canViewDraftEvents: true,
    canCreateActions: true,
    canManageActions: true,
    type: TeamRoleType.ManagerRole,
  },
  {
    name: 'Communication',
    color: Colors.Purple,
    canManageProfile: true,
    canViewJoins: true,
    canViewDraftEvents: true,
    canCreateContents: true,
    canManageContents: true,
    type: TeamRoleType.ManagerRole,
  },
  {
    name: 'Cohésion',
    color: Colors.Orange,
    canViewJoins: true,
    canManageJoins: true,
    canManageMemberRoles: true,
    canManageRoles: true,
    canViewDraftEvents: true,
    canCreateActions: true,
    canManageActions: true,
    canCreateContents: true,
    canManageContents: true,
    type: TeamRoleType.ManagerRole,
  },
];

export const DEFAULT_TENANT_ROLES = [
  {
    name: 'Administration',
    type: TenantRoleType.Administration,
    color: Colors.Red,
    canCreateTeam: true,
    canManageTenantLocation: true,
    canManageEventApprovalSteps: true,
    canManageEventApprovals: true,
    canManageTenant: true,
  },
  { name: 'Étudiant', type: TenantRoleType.Student, color: Colors.Blue },
  { name: 'Professeur', type: TenantRoleType.Teacher, color: Colors.LightOrange },
];
