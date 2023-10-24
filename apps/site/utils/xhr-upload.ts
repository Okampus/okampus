import { getS3Url } from './s3/get-s3-url';
import { apolloClient } from '../app/_context/apollo';
import { InsertFileUploadDocument } from '@okampus/shared/graphql';

import type { InsertFileUploadMutationResult } from '@okampus/shared/graphql';
import type { PresignedUrl } from '@okampus/shared/types';

export type OnUploaded = (data: (PresignedUrl & { fileUploadId: string }) | null) => void;
export type InitUploadRequestOptions = {
  presignedUrl: PresignedUrl;
  setProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
  onUploaded?: OnUploaded;
};

export function initUploadRequest({
  presignedUrl,
  setProgress,
  onError,
  onUploaded,
}: InitUploadRequestOptions): [XMLHttpRequest, (file: File) => void] {
  const xhr = new XMLHttpRequest();

  const insertFileUpload = async (name: string, size: number, type: string) => {
    if (xhr.status === 200) {
      // File upload is successful
      const { data, errors } = await apolloClient.mutate<InsertFileUploadMutationResult>({
        mutation: InsertFileUploadDocument,
        variables: { object: { bucket: presignedUrl.bucket, size, name, type, url: getS3Url(presignedUrl) } },
      });

      const fileUpload = data?.data?.insertFileUploadOne;
      if (!fileUpload || errors) return onError?.(new Error('Failed to upload file'));
      onUploaded?.({ ...presignedUrl, fileUploadId: fileUpload.id });
    } else {
      // Handle the error here
      console.error('Upload failed:', xhr.statusText);
      onError?.(new Error('Failed to upload file'));
    }
  };

  xhr.upload.addEventListener('progress', (event) => {
    if (event.lengthComputable) {
      const percentage = (event.loaded / event.total) * 100;
      setProgress?.(percentage);
    }
  });

  const uploadFile = (file: File) => {
    xhr.open('PUT', presignedUrl.url, true);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) insertFileUpload(file.name, file.size, file.type);
    });

    xhr.send(file);
  };

  xhr.addEventListener('error', () => {
    console.error('Upload failed:', xhr.statusText);
    onError?.(new Error('Failed to upload file'));
  });

  return [xhr, uploadFile];
}
