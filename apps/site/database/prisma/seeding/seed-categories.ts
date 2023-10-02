import { DEFAULT_CATEGORIES } from './defaults';
import { prisma } from '../db';
import { parseSeedYaml } from '../parse-seed-yaml';
import { createImageUpload } from '../services/upload';
import { seedingBucket } from '../../../config/secrets';
import { readS3File } from '../../../server/utils/read-s3-file';

import { Colors, TagType, EntityNames, S3BucketNames } from '@okampus/shared/enums';
import { randomEnum, toSlug } from '@okampus/shared/utils';

import type { S3Client } from '@aws-sdk/client-s3';

type CategoryData = { name: string; color: Colors; slug: string };
function fakeSeedCategories(): CategoryData[] {
  return DEFAULT_CATEGORIES.map((name) => {
    return { name, color: randomEnum(Colors), slug: toSlug(name) };
  });
}

type SeedCategoriesOptions = { s3Client: S3Client | null; tenant: { id: bigint; domain: string }; useFaker?: boolean };
export async function seedCategories({ s3Client, tenant, useFaker }: SeedCategoriesOptions) {
  const faker = useFaker ? fakeSeedCategories : () => [];
  const categoriesData = await parseSeedYaml(s3Client, `${tenant.domain}/categories.yaml`, faker);

  return await Promise.all(
    categoriesData.map(async ({ name, color, slug }) => {
      const data = { color, slug: slug || toSlug(name), type: TagType.TeamCategory, name, tenantScopeId: tenant.id };
      const tag = await prisma.tag.create({ data });

      const buffer =
        s3Client && seedingBucket
          ? await readS3File(s3Client, seedingBucket, `${tenant.domain}/categories.yaml`)
          : null;

      if (buffer) {
        try {
          const file = { buffer, size: buffer.length, filename: name, mimetype: 'image/webp' };
          const image = await createImageUpload(file, S3BucketNames.Thumbnails, EntityNames.Tag, 200, {
            tenantScopeId: tenant.id,
          });

          if (image) await prisma.tag.update({ where: { id: tag.id }, data: { imageId: image.id } });
        } catch (error) {
          console.error(error);
        }
      }

      return tag;
    }),
  );
}
