import GenericArchive from '@okampus/assets/svg/mimetypes/generic/generic-archive.svg';
import GenericAudio from '@okampus/assets/svg/mimetypes/generic/generic-audio.svg';
import GenericCode from '@okampus/assets/svg/mimetypes/generic/generic-code.svg';
import GenericDocumentIcon from '@okampus/assets/svg/mimetypes/generic/generic-document.svg';
import GenericExecutableIcon from '@okampus/assets/svg/mimetypes/generic/generic-executable.svg';
import GenericImageIcon from '@okampus/assets/svg/mimetypes/generic/generic-image.svg';
import GenericTabularIcon from '@okampus/assets/svg/mimetypes/generic/generic-tabular.svg';
import GenericTextIcon from '@okampus/assets/svg/mimetypes/generic/generic-tabular.svg';
import GenericVideoIcon from '@okampus/assets/svg/mimetypes/generic/generic-video.svg';

import PDFIcon from '@okampus/assets/svg/mimetypes/document/pdf.svg';
import MarkdownIcon from '@okampus/assets/svg/mimetypes/document/md.svg';

import RARIcon from '@okampus/assets/svg/mimetypes/archive/rar.svg';
import ZIPicon from '@okampus/assets/svg/mimetypes/archive/zip.svg';

import SVGIcon from '@okampus/assets/svg/mimetypes/image/svg.svg';

import TTFIcon from '@okampus/assets/svg/mimetypes/font/ttf.svg';
import WOFFIcon from '@okampus/assets/svg/mimetypes/font/woff.svg';

import WordIcon from '@okampus/assets/svg/mimetypes/office/x-office-document.svg';
import PPTIcon from '@okampus/assets/svg/mimetypes/office/x-office-presentation.svg';
import ExcelIcon from '@okampus/assets/svg/mimetypes/office/x-office-spreadsheet.svg';

import GenericUnknownIcon from '@okampus/assets/svg/mimetypes/generic/generic-unknown.svg';

import { EXCEL_EXTS, POWERPOINT_EXTS, WORD_EXTS } from '@okampus/shared/consts';
import { FileMimeCategory } from '@okampus/shared/enums';
import { getExtension, parseFileMimeCategory } from '@okampus/shared/utils';

import type { FileMimeCheckPayload } from '@okampus/shared/types';

const fileTypeIcons: { [key in FileMimeCategory]: React.ReactNode } = {
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

export type FileIconProps = { file: FileMimeCheckPayload; className?: string; style?: React.CSSProperties };
export default function FileIcon({ file, className, style }: FileIconProps) {
  const icon = getFileTypeIcon(file);

  // eslint-disable-next-line @next/next/no-img-element
  return <img alt="" src={icon} className={className} style={{ aspectRatio: '1/1', display: 'block', ...style }} />;
}
