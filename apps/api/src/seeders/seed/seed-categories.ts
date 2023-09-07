import { getCategoriesData } from './data/categories.data';

import { Tag } from '@okampus/api/dal';
import { BucketNames, EntityName, TagType } from '@okampus/shared/enums';

import type { UploadsService } from '@okampus/api/bll';
import type { S3Client } from '@aws-sdk/client-s3';
import type { Tenant } from '@okampus/api/dal';
import type { EntityManager } from '@mikro-orm/core';

export async function seedCategories(
  s3Client: S3Client | null,
  em: EntityManager,
  uploadService: UploadsService,
  tenant: Tenant,
): Promise<Tag[]> {
  const categoriesData = await getCategoriesData(s3Client, tenant);
  const iconConfig = { encoding: '7bit', mimetype: 'image/webp', fieldname: 'icon', fileLastModifiedAt: new Date() };
  return await Promise.all(
    categoriesData.map(async ({ icon, name, color, slug }) => {
      const tag = new Tag({ color, slug, type: TagType.TeamCategory, name, createdBy: null, tenantScope: tenant });
      await em.persistAndFlush(tag);

      if (icon) {
        const persistedTag = await em.findOne(Tag, { id: tag.id });
        if (persistedTag) {
          const image = await uploadService.createImageUpload(
            { ...iconConfig, buffer: icon, size: icon.length, filename: name },
            BucketNames.Thumbnails,
            { entityName: EntityName.Tag, entityId: persistedTag.id, createdBy: null, tenantScope: tenant },
            200,
          );

          tag.image = image;
          await em.persistAndFlush([tag, image]);
        }
      }

      return tag;
    }),
  );
}
