import { getExtension } from './get-extensions';
import {
  ARCHIVE_EXTS,
  AUDIO_EXTS,
  CODE_EXTS,
  DOCUMENT_EXTS,
  EXECUTABLE_EXTS,
  FONT_EXTS,
  IMAGE_EXTS,
  MARKDOWN_EXTS,
  PRESENTATION_EXTS,
  SPREADSHEET_EXTS,
  TABULAR_EXTS,
  VIDEO_EXTS,
} from '@okampus/shared/consts';
import { FileMimeCategory } from '@okampus/shared/enums';
import type { FileMimeCheckPayload } from '@okampus/shared/types';

const documentRegex =
  /application\/((x-|vnd\.)?(tex|rtf|msword|openxmlformats-officedocument\.wordprocessingml\.document)(-.*)?)|text\/(x-|vnd\.)?markdown/;
const tabularRegex = /text\/(csv|tsv|tab-separated-values|comma-separated-values)/;
const markdownRegex = /text\/(x-|vnd\.)?markdown/;

const presentationRegex =
  /application\/((x-|vnd\.)?(mspowerpoint|openxmlformats-officedocument\.presentationml\.presentation)(-.*)?)/;
const spreadsheetRegex =
  /application\/((x-|vnd\.)?(msexcel|openxmlformats-officedocument\.spreadsheetml\.sheet)(-.*)?)/;

const executableRegex = /application\/(x-|vnd\.)?(microsoft.portable-executable|ms-application)(-.*)?/;

const rarRegex = /application\/(x-|vnd)?rar(-.*)?/;
const zipRegex = /application\/(x-|vnd)?zip(-.*)?/;
const pdfRegex = /application\/(x-|vnd)?pdf/;

export function parseFileMimeCategory(fileCheckPayload: FileMimeCheckPayload): FileMimeCategory {
  if (fileCheckPayload.type.startsWith('image/'))
    return fileCheckPayload.type === 'image/svg+xml' ? FileMimeCategory.SVG : FileMimeCategory.Image;

  const ext = getExtension(fileCheckPayload.name);
  if (fileCheckPayload.type.startsWith('text/')) {
    if (tabularRegex.test(fileCheckPayload.type)) return FileMimeCategory.Tabular;
    if (markdownRegex.test(fileCheckPayload.type)) return FileMimeCategory.Markdown;

    if (!ext) return FileMimeCategory.Text;
    if (CODE_EXTS.includes(ext)) return FileMimeCategory.Code;
    if (MARKDOWN_EXTS.includes(ext)) return FileMimeCategory.Markdown;
    if (TABULAR_EXTS.includes(ext)) return FileMimeCategory.Tabular;
    if (FONT_EXTS.includes(ext)) return FileMimeCategory.Font;
    if (DOCUMENT_EXTS.includes(ext)) return FileMimeCategory.Document;

    return FileMimeCategory.Text;
  }

  if (fileCheckPayload.type.startsWith('application/')) {
    if (rarRegex.test(fileCheckPayload.type)) return FileMimeCategory.RAR;
    if (zipRegex.test(fileCheckPayload.type)) return FileMimeCategory.ZIP;
    if (pdfRegex.test(fileCheckPayload.type)) return FileMimeCategory.PDF;
    if (documentRegex.test(fileCheckPayload.type)) return FileMimeCategory.Document;
    if (presentationRegex.test(fileCheckPayload.type)) return FileMimeCategory.Presentation;
    if (spreadsheetRegex.test(fileCheckPayload.type)) return FileMimeCategory.Spreadsheet;
    if (executableRegex.test(fileCheckPayload.type)) return FileMimeCategory.Executable;
  }

  if (fileCheckPayload.type.startsWith('video/')) return FileMimeCategory.Video;
  if (fileCheckPayload.type.startsWith('audio/')) return FileMimeCategory.Audio;

  if (fileCheckPayload.type.startsWith('font/')) {
    if (fileCheckPayload.type === 'font/ttf') return FileMimeCategory.TTF;
    if (fileCheckPayload.type === 'font/woff' || fileCheckPayload.type === 'font/woff2') return FileMimeCategory.WOFF;
    return FileMimeCategory.Font;
  }

  if (!ext) return FileMimeCategory.Unknown;

  if (ext === 'svg') return FileMimeCategory.SVG;
  if (ext === 'pdf') return FileMimeCategory.PDF;
  if (ext === 'zip') return FileMimeCategory.ZIP;
  if (ext === 'rar') return FileMimeCategory.RAR;
  if (ext === 'ttf') return FileMimeCategory.TTF;
  if (ext === 'woff' || ext === 'woff2') return FileMimeCategory.WOFF;
  if (ext === 'md') return FileMimeCategory.Markdown;

  if (EXECUTABLE_EXTS.includes(ext)) return FileMimeCategory.Executable;
  if (IMAGE_EXTS.includes(ext)) return FileMimeCategory.Image;
  if (CODE_EXTS.includes(ext)) return FileMimeCategory.Code;
  if (DOCUMENT_EXTS.includes(ext)) return FileMimeCategory.Document;
  if (ARCHIVE_EXTS.includes(ext)) return FileMimeCategory.Archive;
  if (AUDIO_EXTS.includes(ext)) return FileMimeCategory.Audio;
  if (VIDEO_EXTS.includes(ext)) return FileMimeCategory.Video;
  if (TABULAR_EXTS.includes(ext)) return FileMimeCategory.Tabular;
  if (SPREADSHEET_EXTS.includes(ext)) return FileMimeCategory.Spreadsheet;
  if (PRESENTATION_EXTS.includes(ext)) return FileMimeCategory.Presentation;

  return FileMimeCategory.Unknown;
}
