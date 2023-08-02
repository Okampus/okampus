import { getExtension } from './get-extensions';
import { IMAGE_EXTS } from '@okampus/shared/consts';
import type { FileMimeCheckPayload } from '@okampus/shared/types';

export const checkPdf = ({ mimetype }: FileMimeCheckPayload) => mimetype === 'application/pdf';
export const checkImage = ({ mimetype, name }: FileMimeCheckPayload) => {
  if (mimetype.startsWith('image/')) return true;
  const ext = getExtension(name);
  return Boolean(ext) && IMAGE_EXTS.includes(ext);
};
export const checkVideo = ({ mimetype }: FileMimeCheckPayload) => mimetype.startsWith('video/');
export const checkDocument = ({ mimetype }: FileMimeCheckPayload) => mimetype.startsWith('application/');
