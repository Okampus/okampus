import { getExtension } from './get-extensions';
import { IMAGE_EXTS } from '@okampus/shared/consts';
import type { FileMetadata } from '@okampus/shared/types';

export const checkImage = ({ mimetype, filename }: FileMetadata) => {
  if (mimetype.startsWith('image/')) return true;
  const ext = getExtension(filename);
  return Boolean(ext) && IMAGE_EXTS.includes(ext);
};
export const checkVideo = ({ mimetype }: FileMetadata) => mimetype.startsWith('video/');

export const checkDocument = ({ mimetype }: FileMetadata) => mimetype.startsWith('application/');
export const checkPdf = ({ mimetype }: FileMetadata) => mimetype === 'application/pdf';
