import { N_DEFAULT_MAX_MISSION_QUANTITY, N_DEFAULT_MIN_MISSION_QUANTITY } from '../seeders/defaults';
import { prisma } from '../db';

import { pickOneRandom, randomEnum, randomInt } from '@okampus/shared/utils';

import { Colors } from '@prisma/client';
import { faker } from '@faker-js/faker';

const potentialRoles = [
  'Responsable de vestiaire',
  'Responsable de la sécurité',
  "Aide à l'organisation",
  "Aide à l'animation",
];

export type FakeMissionOptions = { createdById: bigint; projectId?: bigint; teamId: bigint; tenantScopeId: bigint };
export async function fakeMission({ projectId, teamId, tenantScopeId, createdById }: FakeMissionOptions) {
  const mission = await prisma.mission.create({
    data: {
      name: pickOneRandom(potentialRoles),
      color: randomEnum(Colors),
      description: faker.lorem.paragraph(),
      pointsMinimum: 1,
      pointsMaximum: 10,
      quantity: randomInt(N_DEFAULT_MIN_MISSION_QUANTITY, N_DEFAULT_MAX_MISSION_QUANTITY),
      projectId,
      teamId,
      createdById,
      tenantScopeId,
    },
  });

  return mission;
}
