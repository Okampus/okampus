import { customSeederFolder } from './consts';
import { config } from '../config';

import { readFileOrNull } from '@okampus/api/shards';
import { TeamType } from '@okampus/shared/enums';
import { readS3File, parseYaml, toSlug } from '@okampus/shared/utils';

import path from 'node:path';

import type { TeamData } from './types/team.seed';
import type { S3Client } from '@aws-sdk/client-s3';
import type { Tag, Tenant } from '@okampus/api/dal';
import type { EntityManager } from '@mikro-orm/core';

export async function seedTeams(
  s3Client: S3Client | null,
  em: EntityManager,
  context: { categories: Tag[]; tenant: Tenant },
): Promise<TeamData[] | null> {
  const { categories, tenant } = context;

  let file;
  try {
    file = s3Client
      ? await readS3File(s3Client, config.s3.bucketSeeding, `${tenant.domain}/teams.yaml`)
      : await readFileOrNull(path.join(customSeederFolder, 'teams.yaml'));
  } catch {
    return null;
  }

  if (!file) return null;

  const teams = await parseYaml<TeamData[]>(file.toString());
  if (!Array.isArray(teams)) return null;

  const correctTeams = teams.filter(({ name }) => typeof name === 'string' && name.length > 0);
  if (correctTeams.length === 0) return null;

  return await Promise.all(
    correctTeams.map(async (team: TeamData) => {
      const categorySlugs = team.categories && Array.isArray(team.categories) ? team.categories : [];
      const avatarFile = s3Client
        ? await readS3File(s3Client, config.s3.bucketSeeding, `${tenant.domain}/avatars/${team.name}.webp`)
        : await readFileOrNull(path.join(customSeederFolder, 'avatars', `${team.name}.webp`));

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
