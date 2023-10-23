import { DEFAULT_CATEGORIES } from './defaults';
import { parseSeedYaml } from './from-yaml';
import { prisma } from '../db';
import { upload } from '../services/upload';
import { seedingBucket } from '../../../config/secrets';

import { AuthContextMaybeUser } from '../../../server/actions/utils/withAuth';
import { readS3File } from '../../../server/utils/read-s3-file';
import { getS3Key } from '../../../utils/s3/get-s3-key';

import { EntityNames, S3BucketNames } from '@okampus/shared/enums';
import { randomEnum, toSlug } from '@okampus/shared/utils';

import { Colors, TagType } from '@prisma/client';

import type { S3Client } from '@aws-sdk/client-s3';

type CategoryData = { name: string; color: Colors; slug: string };
function fakeSeedCategories(): CategoryData[] {
  return Object.entries(DEFAULT_CATEGORIES).map(([slug, name]) => {
    return { name, color: randomEnum(Colors), slug };
  });
}

type SeedCategoriesOptions = { s3Client: S3Client | null; tenant: { id: bigint; domain: string }; useFaker?: boolean };
export async function seedCategories({ s3Client, tenant, useFaker }: SeedCategoriesOptions) {
  const faker = useFaker ? fakeSeedCategories : () => [];
  const categoriesData = await parseSeedYaml(s3Client, `${tenant.domain}/categories.yaml`, faker);
  const authContext: AuthContextMaybeUser = { tenant, role: 'admin' };

  return await Promise.all(
    categoriesData.map(async ({ name, color, slug }) => {
      const data = { color, slug: slug || toSlug(name), type: TagType.Category, name, tenantScopeId: tenant.id };
      const tag = await prisma.tag.create({ data });

      const buffer =
        s3Client && seedingBucket
          ? await readS3File(s3Client, seedingBucket, `${tenant.domain}/categories.yaml`)
          : null;

      if (buffer) {
        try {
          // const file = new File([buffer], name, { type: 'image/webp' });
          const blob = new Blob([buffer], { type: 'image/webp' });
          const key = getS3Key(`${tag.id}`, EntityNames.Tag, tenant.id);
          await upload({ bucketName: S3BucketNames.Thumbnails, blob, key, authContext }, async ({ id }) => {
            await prisma.tag.update({ where: { id: tag.id }, data: { iconId: id } });
          });
        } catch (error) {
          console.error(error);
        }
      }

      return tag;
    }),
  );
}
