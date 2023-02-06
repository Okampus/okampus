import { getExtension } from './get-extensions';
import { IMAGE_EXTS } from '@okampus/shared/consts';
import type { FileMimeCheckPayload } from '@okampus/shared/types';

export const checkPdf = ({ type }: FileMimeCheckPayload) => type === 'application/pdf';
export const checkImage = ({ type, name }: FileMimeCheckPayload) => {
  if (type.startsWith('image/')) return true;
  const ext = getExtension(name);
  return Boolean(ext) && IMAGE_EXTS.includes(ext);
};
export const checkVideo = ({ type }: FileMimeCheckPayload) => type.startsWith('video/');
export const checkDocument = ({ type }: FileMimeCheckPayload) => type.startsWith('application/');
