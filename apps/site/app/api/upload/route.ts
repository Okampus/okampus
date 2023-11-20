'use server';

import { uploadFileSchema } from '../../../schemas/FileUpload/uploadFile';

import { ServerError } from '../../../server/error';
import { upload } from '../../../server/services/upload';
import { withAuth } from '../../../server/utils/withAuth';
import { withZod } from '../../../server/utils/withZod';

import { randomId, toSlug } from '@okampus/shared/utils';

export async function PUT(request: Request) {
  const authContext = await withAuth();
  const data = await withZod({ formData: await request.formData(), zodSchema: uploadFileSchema });

  const key = toSlug(data.fileName ?? randomId());
  const file = await upload({ blob: data.blob, bucketName: data.bucketName, key, authContext });

  if (!file) throw new ServerError('S3_ERROR');
  return new Response(file.id.toString());
}
