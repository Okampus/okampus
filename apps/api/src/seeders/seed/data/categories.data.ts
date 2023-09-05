import { seedConfig, customSeederFolder } from '../../seed.config';
import { config } from '../../../config';

import { readFileOrNull, readS3File } from '@okampus/api/shards';
import { parseYaml, randomEnum, toSlug } from '@okampus/shared/utils';

import { Colors } from '@okampus/shared/enums';
import path from 'node:path';

import type { S3Client } from '@aws-sdk/client-s3';
import type { Tenant } from '@okampus/api/dal';

type CategoryData = { name: string; color: Colors; slug?: string; icon?: string };
export async function getCategoriesData(s3Client: S3Client | null, tenant: Tenant): Promise<CategoryData[]> {
  const file = s3Client
    ? await readS3File(s3Client, config.s3.bucketSeeding, `${tenant.domain}/categories.yaml`)
    : await readFileOrNull(path.join(customSeederFolder, 'categories.yaml'));

  if (!file) return seedConfig.DEFAULT_CATEGORIES;

  let categories = await parseYaml<CategoryData[]>(path.join(customSeederFolder, 'categories.yaml'));
  if (!Array.isArray(categories)) return seedConfig.DEFAULT_CATEGORIES;

  categories = categories.filter(({ name }) => typeof name === 'string' && name.length > 0);
  if (categories.length === 0) return seedConfig.DEFAULT_CATEGORIES;

  return await Promise.all(
    categories.map(async (category: CategoryData) => {
      const color = category.color || randomEnum(Colors);
      const slug =
        typeof category.slug === 'string' && category.slug.length > 0 ? category.slug : toSlug(category.name);
      const icon = category.icon ?? `${slug}.webp`;
      return { name: category.name, slug, color, icon };
    }),
  );
}
