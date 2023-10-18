import { getAuthContext } from './auth-context';
// import { createImageUpload } from '../../database/prisma/services/upload';
// import { prisma } from '../../database/prisma/db';

import { getTranslation } from '../ssr/getTranslation';
import { getNextLang } from '../ssr/getLang';
// import { ActorImageType, EntityNames, S3BucketNames } from '@okampus/shared/enums';
// import { NextResponse } from 'next/server';
import type { NextFormMessages } from '../../app/_forms/NextForm/NextForm';

// TEMP
export async function upload(_previousState: NextFormMessages, formData: FormData): Promise<NextFormMessages> {
  const { t } = await getTranslation(getNextLang());
  const auth = await getAuthContext();
  if (!('userId' in auth)) return auth;

  const file = formData.get('file');
  if (!file || !(file instanceof File)) return { errors: { root: t('server-errors', 'missing_file') } };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return {};

  // const upload = await createImageUpload(
  //   buffer,
  //   { filename: file.name, mimetype: file.type },
  //   S3BucketNames.ActorImages,
  //   EntityNames.ActorImage,
  //   200,
  //   { tenantScopeId, createdById: userId },
  // );

  // const actorImage = await prisma.actorImage.create({
  //   data: {
  //     type: ActorImageType.Avatar,
  //     createdById: BigInt(userId),
  //     deletedAt: null,
  //     tenantScopeId: BigInt(tenantScopeId),
  //     actorId: BigInt(userId),
  //     imageId: upload.id,
  //   },
  // });

  // return NextResponse.json({ actorImage });
}
