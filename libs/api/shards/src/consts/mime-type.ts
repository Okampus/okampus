const typeTypes = [
  'audio/.*',
  'image/.*',
  'video/.*',
  'text/.*',
  'application/msword',
  'application/vnd\\.openxmlformats-officedocument\\.wordprocessingml\\.document',
  'application/msexcel',
  'application/vnd\\.openxmlformats-officedocument\\.spreadsheetml\\.sheet',
  'application/mspowerpoint',
  'application/vnd\\.openxmlformats-officedocument\\.presentationml\\.presentation',
  'application/vnd\\.oasis\\.opendocument\\.presentation',
  'application/vnd\\.oasis\\.opendocument\\.spreadsheet',
  'application/vnd\\.oasis\\.opendocument\\.text',
  'application/pdf',
  'application/x-ipynb\\+json',
  'application/json',
  'application/x-yaml',
  'application/xml',
  'application/gzip',
  'application/vnd\\.rar',
  'application/x-7z-compressed',
  'application/x-gzip',
  'application/x-rar-compressed',
  'application/zip',
];

export const MIME_REGEX = new RegExp(`^(${typeTypes.join('|')})$`, 'i');

const simpleImageMimeTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];

export const IMAGE_MIME_REGEX = new RegExp(`^(${simpleImageMimeTypes.join('|')})$`, 'i');
