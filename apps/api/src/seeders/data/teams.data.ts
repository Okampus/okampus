import { customSeederFolder, seedConfig } from '../seed.config';
import { config } from '../../config';

import { readFileOrNull, readS3File } from '@okampus/api/shards';
import { TeamType } from '@okampus/shared/enums';
import { parseYaml, randomFromArray, randomId, randomInt, toSlug } from '@okampus/shared/utils';

import { faker } from '@faker-js/faker';
import path from 'node:path';

import type { S3Client } from '@aws-sdk/client-s3';
import type { Tag, Tenant } from '@okampus/api/dal';
import type { SocialType } from '@okampus/shared/enums';

export type TeamData = {
  name: string;
  type: TeamType;
  email?: string;
  website?: string;
  status?: string;
  bio?: string;
  categories?: string[];
  socials: {
    pseudo: string;
    type: SocialType;
    url: string;
  }[];
  slug?: string;
  avatar?: Buffer | null;
  parent?: string;
  originalCreationDay?: number;
  originalCreationMonth?: number;
  originalCreationYear?: number;
  expectingPresidentEmail?: string;
  expectingTreasurerEmail?: string;
  expectingSecretaryEmail?: string;
  initialSubvention?: number;
  bankInfo?: {
    bankName: string;
    bicSwift: string;
    branchAddressGeoapifyId: string;
    iban: string;
  };
};

function fakeTeamsData(categories: Tag[], tenant: Tenant): TeamData[] {
  return Array.from({ length: seedConfig.N_TEAMS }).map(() => {
    const name = faker.company.name();
    return {
      name,
      email: `${toSlug(name)}@${tenant.domain}.fr`,
      avatar: null,
      bio: faker.lorem.paragraph(randomInt(2, 12)),
      tags: randomFromArray(categories, 1, 3),
      socials: [],
      slug: `${toSlug(name)}-${randomId()}`,
      status: faker.company.catchPhrase(),
      type: TeamType.Association,
    };
  });
}

export async function getTeamsData(
  s3Client: S3Client | null,
  context: { categories: Tag[]; tenant: Tenant },
): Promise<TeamData[]> {
  const { categories, tenant } = context;

  const file = s3Client
    ? await readS3File(s3Client, config.s3.bucketSeeding, `${tenant.domain}/teams.yaml`)
    : await readFileOrNull(path.join(customSeederFolder, 'teams.yaml'));

  if (!file) return fakeTeamsData(categories, tenant);

  const teamsData = await parseYaml<TeamData[]>(file.toString());
  if (!Array.isArray(teamsData)) return fakeTeamsData(categories, tenant);

  const teams = teamsData.filter(({ name }) => typeof name === 'string' && name.length > 0);
  if (teams.length === 0) return fakeTeamsData(categories, tenant);

  return await Promise.all(
    teams.map(async (team: TeamData) => {
      const categorySlugs = team.categories && Array.isArray(team.categories) ? team.categories : [];
      const avatarFile = s3Client
        ? await readS3File(s3Client, config.s3.bucketSeeding, `${tenant.domain}/avatars/${team.slug}.webp`)
        : await readFileOrNull(path.join(customSeederFolder, 'avatars', `${team.slug}.webp`));

      return {
        avatar: avatarFile ?? null,
        bio: team.bio ?? '',
        email: team.email ?? '',
        name: team.name,
        originalCreationDay: team.originalCreationDay,
        originalCreationMonth: team.originalCreationMonth,
        originalCreationYear: team.originalCreationYear,
        parent: team.parent,
        slug: team.slug || toSlug(team.name),
        socials: team.socials ?? [],
        status: team.status ?? '',
        tags: categorySlugs.map((slug) => categories.find((category) => category.slug === slug)).filter(Boolean),
        website: team.website ?? '',
        type: team.parent ? TeamType.Club : TeamType.Association,
      };
    }),
  );
}
