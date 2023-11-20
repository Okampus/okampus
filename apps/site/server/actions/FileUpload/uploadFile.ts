'use server';

import { withAuth } from '../../utils/withAuth';
import { withZod } from '../../utils/withZod';
import { withErrorHandling } from '../../utils/withErrorHandling';

import { upload } from '../../../server/services/upload';

import { uploadFileSchema } from '../../../schemas/FileUpload/uploadFile';
import { ServerError } from '../../error';
import { randomId, toSlug } from '@okampus/shared/utils';
import type { FormMessages } from '../types';

export default withErrorHandling(async function uploadFile(_previous: FormMessages<bigint>, formData: FormData) {
  const authContext = await withAuth();
  const data = await withZod({ formData, zodSchema: uploadFileSchema });

  const key = toSlug(data.fileName ?? randomId());
  const file = await upload({ blob: data.blob, bucketName: data.bucketName, key, authContext });

  if (!file) throw new ServerError('S3_ERROR');
  return { data: file.id };
});
