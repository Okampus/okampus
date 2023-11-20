import { protocol, baseUrl } from '../config';
import { ServerError } from '../server/error';

import type { S3BucketNames } from '@okampus/shared/enums';

export type UploadFileOptions = {
  file: File;
  domain: string;
  bucketName: S3BucketNames;
  onError?: (error: Error) => void;
  onUploaded?: (id: string) => void;
  onProgress?: (progress: number) => void;
};

// TODO: add abort handler
export function xhrUploadFile({ file, domain, bucketName, onError, onUploaded, onProgress }: UploadFileOptions) {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('fileName', file.name);
  formData.append('bucketName', bucketName);

  const xhr = new XMLHttpRequest();
  xhr.upload.addEventListener(
    'progress',
    (event) => event.lengthComputable && onProgress?.((event.loaded / event.total) * 100),
    false,
  );

  xhr.addEventListener('load', () => onUploaded?.(xhr.responseText), false);
  xhr.addEventListener('error', () => onError?.(new ServerError('S3_ERROR')), false);

  xhr.open('PUT', `${protocol}://${domain}.${baseUrl}/api/upload`);
  xhr.send(formData);
}
