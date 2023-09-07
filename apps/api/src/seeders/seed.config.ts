import { rootPath } from '../config';
import { Colors } from '@okampus/shared/enums';
import path from 'node:path';

export const assetsFolder = path.join(rootPath, 'libs', 'assets', 'src');
export const customSeederFolder = path.join(rootPath, 'apps', 'api', 'src', 'seeders', 'custom');

export const seedConfig = {
  N_ADMINS: 10,
  N_STUDENTS: 150,
  N_TEACHERS: 10,

  N_TEAMS: 12,
  N_COMPANIES: 20,

  N_APPROVAL_STEPS: 3,
  MIN_ADMINS_BY_STEP: 1,
  MAX_ADMINS_BY_STEP: 3,

  MIN_MEMBERS: 3,
  MAX_MEMBERS: 7,

  MIN_REQUESTS: 2,
  MAX_REQUESTS: 5,

  MIN_PROJECTS_BY_TEAM: 1,
  MAX_PROJECTS_BY_TEAM: 3,

  MIN_EVENTS_BY_PROJECT: 1,
  MAX_EVENTS_BY_PROJECT: 4,

  DEFAULT_CATEGORIES: [
    { name: 'Arts', slug: 'arts', color: Colors.LightBlue },
    { name: 'Culture et loisirs', slug: 'culture', color: Colors.LightRed },
    { name: 'Événementiel', slug: 'events', color: Colors.Turquoise },
    { name: 'Humanitaire', slug: 'humanitarian', color: Colors.Blue },
    { name: 'International', slug: 'international', color: Colors.Indigo },
    { name: 'Professionnel', slug: 'professional', color: Colors.Cyan },
    { name: 'Sport', slug: 'sports', color: Colors.Green },
    { name: 'Technologie', slug: 'technology', color: Colors.DarkPurple },
  ],

  MIN_TAGS: 6,
  MAX_TAGS: 20,
};