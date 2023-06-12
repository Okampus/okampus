import { ReactComponent as GenericArchive } from '@okampus/assets/svg/mimetypes/generic/generic-archive.svg';
import { ReactComponent as GenericAudio } from '@okampus/assets/svg/mimetypes/generic/generic-audio.svg';
import { ReactComponent as GenericCode } from '@okampus/assets/svg/mimetypes/generic/generic-code.svg';
import { ReactComponent as GenericDocumentIcon } from '@okampus/assets/svg/mimetypes/generic/generic-document.svg';
import { ReactComponent as GenericExecutableIcon } from '@okampus/assets/svg/mimetypes/generic/generic-executable.svg';
import { ReactComponent as GenericImageIcon } from '@okampus/assets/svg/mimetypes/generic/generic-image.svg';
import { ReactComponent as GenericTabularIcon } from '@okampus/assets/svg/mimetypes/generic/generic-tabular.svg';
import { ReactComponent as GenericTextIcon } from '@okampus/assets/svg/mimetypes/generic/generic-tabular.svg';
import { ReactComponent as GenericVideoIcon } from '@okampus/assets/svg/mimetypes/generic/generic-video.svg';

import { ReactComponent as PDFIcon } from '@okampus/assets/svg/mimetypes/document/pdf.svg';
import { ReactComponent as MarkdownIcon } from '@okampus/assets/svg/mimetypes/document/md.svg';

import { ReactComponent as RARIcon } from '@okampus/assets/svg/mimetypes/archive/rar.svg';
import { ReactComponent as ZIPicon } from '@okampus/assets/svg/mimetypes/archive/zip.svg';

import { ReactComponent as SVGIcon } from '@okampus/assets/svg/mimetypes/image/svg.svg';

import { ReactComponent as TTFIcon } from '@okampus/assets/svg/mimetypes/font/ttf.svg';
import { ReactComponent as WOFFIcon } from '@okampus/assets/svg/mimetypes/font/woff.svg';

import { ReactComponent as WordIcon } from '@okampus/assets/svg/mimetypes/office/x-office-document.svg';
import { ReactComponent as PPTIcon } from '@okampus/assets/svg/mimetypes/office/x-office-presentation.svg';
import { ReactComponent as ExcelIcon } from '@okampus/assets/svg/mimetypes/office/x-office-spreadsheet.svg';

import { ReactComponent as GenericUnknownIcon } from '@okampus/assets/svg/mimetypes/generic/generic-unknown.svg';

import { EXCEL_EXTS, POWERPOINT_EXTS, WORD_EXTS } from '@okampus/shared/consts';
import { FileMimeCategory } from '@okampus/shared/enums';
import { getExtension, parseFileMimeCategory } from '@okampus/shared/utils';

import type { FileMimeCheckPayload } from '@okampus/shared/types';
import type { SVGProps } from 'react';

const fileTypeIcons: { [key in FileMimeCategory]: React.FC<SVGProps<SVGSVGElement>> } = {
  [FileMimeCategory.Archive]: GenericArchive,
  [FileMimeCategory.Audio]: GenericAudio,
  [FileMimeCategory.Code]: GenericCode,
  [FileMimeCategory.Document]: GenericDocumentIcon,
  [FileMimeCategory.Executable]: GenericExecutableIcon,
  [FileMimeCategory.Font]: WOFFIcon,
  [FileMimeCategory.Image]: GenericImageIcon,
  [FileMimeCategory.Presentation]: GenericDocumentIcon, // TODO: use presentation icon
  [FileMimeCategory.Spreadsheet]: GenericDocumentIcon, // TODO: use spreadsheet icon
  [FileMimeCategory.Tabular]: GenericTabularIcon,
  [FileMimeCategory.Text]: GenericTextIcon,
  [FileMimeCategory.Video]: GenericVideoIcon,

  [FileMimeCategory.PDF]: PDFIcon,
  [FileMimeCategory.Markdown]: MarkdownIcon,

  [FileMimeCategory.RAR]: RARIcon,
  [FileMimeCategory.ZIP]: ZIPicon,

  [FileMimeCategory.SVG]: SVGIcon,

  [FileMimeCategory.TTF]: TTFIcon,
  [FileMimeCategory.WOFF]: WOFFIcon,

  [FileMimeCategory.Unknown]: GenericUnknownIcon,
};

export function getFileTypeIcon(file: FileMimeCheckPayload) {
  const ext = getExtension(file.name);
  const mimeCategory = parseFileMimeCategory(file);

  switch (mimeCategory) {
    case FileMimeCategory.Spreadsheet: {
      return EXCEL_EXTS.includes(ext) ? ExcelIcon : GenericDocumentIcon;
    }
    case FileMimeCategory.Presentation: {
      return POWERPOINT_EXTS.includes(ext) ? PPTIcon : GenericDocumentIcon;
    }
    case FileMimeCategory.Document: {
      return WORD_EXTS.includes(ext) ? WordIcon : GenericDocumentIcon;
    }
    default: {
      return fileTypeIcons[mimeCategory];
    }
  }
}

export type FileIconProps = { file: FileMimeCheckPayload; className: string };
export function FileIcon({ file, className }: FileIconProps) {
  const icon = getFileTypeIcon(file);
  return icon({ className, style: { aspectRatio: '1/1', display: 'block' } });
}
