import { getCategoriesData } from './data/categories.data';

import { Tag } from '@okampus/api/dal';
import { BucketNames, EntityName, TagType } from '@okampus/shared/enums';

import type { UploadsService } from '@okampus/api/bll';
import type { S3Client } from '@aws-sdk/client-s3';
import type { Tenant } from '@okampus/api/dal';
import type { EntityManager } from '@mikro-orm/core';

type SeedCategoriesOptions = {
  s3Client: S3Client | null;
  em: EntityManager;
  uploadService: UploadsService;
  tenant: Tenant;
};

export async function seedCategories({ s3Client, em, uploadService, tenant }: SeedCategoriesOptions): Promise<Tag[]> {
  const baseOptions = { createdBy: null, tenantScope: tenant };

  const categoriesData = await getCategoriesData(s3Client, tenant);
  const iconConfig = { encoding: '7bit', mimetype: 'image/webp', fieldname: 'icon', fileLastModifiedAt: new Date() };
  return await Promise.all(
    categoriesData.map(async ({ icon, name, color, slug }) => {
      const tagData = new Tag({ color, slug, type: TagType.TeamCategory, name, ...baseOptions });
      await em.persistAndFlush(tagData);

      if (icon) {
        const tag = await em.findOne(Tag, { id: tagData.id });
        if (tag) {
          const file = { ...iconConfig, buffer: icon, size: icon.length, filename: name };
          const context = { entityName: EntityName.Tag, entityId: tag.id, ...baseOptions };
          const image = await uploadService.createImageUpload(file, BucketNames.Thumbnails, context, 200);

          tag.image = image;
          await em.persistAndFlush([tag, image]);
        }
      }

      return tagData;
    }),
  );
}
