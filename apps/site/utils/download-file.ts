'use client';

import { getDateTimeString } from '@okampus/shared/utils';
import type { ExternalFile } from '@okampus/shared/types';

export const getObjectUrl = (blob: Blob) => URL.createObjectURL(blob);

export const download = (href: string, filename: string) => {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  a.click();
  a.remove();
};

export const downloadResource = (url: string, filename?: string) => {
  if (!filename) filename = url.split('\\')?.pop?.()?.split('/').pop() || getDateTimeString(new Date());

  fetch(url, { headers: new Headers({ Origin: location.origin }), mode: 'cors' })
    .then((response) => response.blob())
    .then((blob) => download(getObjectUrl(blob), filename || getDateTimeString(new Date())))
    .catch((error) => console.error(error));
};

export const downloadFile = (file: File | ExternalFile) => {
  file instanceof File ? download(getObjectUrl(file), file.name) : downloadResource(file.url, file.name);
};

export const downloadJSON = (object: object, filename: string) => {
  const dataSrc = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(object));
  download(dataSrc, filename + '.json');
};
