// @index(['./**/*.{ts,tsx}', './*/index.{ts,tsx}'], f => `export * from '${f.path.replace(/\/index$/, '')}'`)
export * from './api/shared';
export * from './global/ansi-codes';
export * from './global/colors';
export * from './global/dates';
export * from './global/files/archive-exts';
export * from './global/files/audio-exts';
export * from './global/files/code-exts';
export * from './global/files/document-exts';
export * from './global/files/executable-exts';
export * from './global/files/font-exts';
export * from './global/files/image-exts';
export * from './global/files/presentation-exts';
export * from './global/files/spreadsheet-exts';
export * from './global/files/tabular-exts';
export * from './global/files/video-exts';
export * from './global/slugs';
export * from './global/statuses';
export * from './global/strings/cookie-names';
export * from './strings';
export * from './ui/event-state-colors';
export * from './ui/standards';
// @endindex
