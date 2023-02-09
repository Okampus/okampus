import GenericArchive from '@okampus/assets/svg/mimetypes/generic/generic-archive.svg?url';
import GenericAudio from '@okampus/assets/svg/mimetypes/generic/generic-audio.svg?url';
import GenericCode from '@okampus/assets/svg/mimetypes/generic/generic-code.svg?url';
import GenericDocumentIcon from '@okampus/assets/svg/mimetypes/generic/generic-document.svg?url';
import GenericExecutableIcon from '@okampus/assets/svg/mimetypes/generic/generic-executable.svg?url';
import GenericImageIcon from '@okampus/assets/svg/mimetypes/generic/generic-image.svg?url';
import GenericTabularIcon from '@okampus/assets/svg/mimetypes/generic/generic-tabular.svg?url';
import GenericTextIcon from '@okampus/assets/svg/mimetypes/generic/generic-tabular.svg?url';
import GenericVideoIcon from '@okampus/assets/svg/mimetypes/generic/generic-video.svg?url';

import PDFIcon from '@okampus/assets/svg/mimetypes/document/pdf.svg?url';
import MarkdownIcon from '@okampus/assets/svg/mimetypes/document/md.svg?url';

import RARIcon from '@okampus/assets/svg/mimetypes/archive/rar.svg?url';
import ZIPicon from '@okampus/assets/svg/mimetypes/archive/zip.svg?url';

import SVGIcon from '@okampus/assets/svg/mimetypes/image/svg.svg?url';

import TTFIcon from '@okampus/assets/svg/mimetypes/font/ttf.svg?url';
import WOFFIcon from '@okampus/assets/svg/mimetypes/font/woff.svg?url';

import WordIcon from '@okampus/assets/svg/mimetypes/office/x-office-document.svg?url';
import PPTIcon from '@okampus/assets/svg/mimetypes/office/x-office-presentation.svg?url';
import ExcelIcon from '@okampus/assets/svg/mimetypes/office/x-office-spreadsheet.svg?url';

import GenericUnknownIcon from '@okampus/assets/svg/mimetypes/generic/generic-unknown.svg?url';

import { FileMimeCategory } from '@okampus/shared/enums';
// import { FunctionComponent, SVGProps } from 'react';
import { getExtension, parseFileMimeCategory } from '@okampus/shared/utils';
import { EXCEL_EXTS, POWERPOINT_EXTS, WORD_EXTS } from '@okampus/shared/consts';
import type { FileMimeCheckPayload } from '@okampus/shared/types';

const fileTypeIcons: { [key in FileMimeCategory]: string } = {
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

// function getFileIcon(file: { type: string }) {
//   if (file.type === 'application/pdf') {
//     return FilePdfBoxIcon({ className: 'bg-white text-red-500 rounded-xl' });
//   } else if (file.type.startsWith('image/')) {
//     return ImageIcon({ className: 'bg-white text-orange-700 rounded-xl' });
//   } else if (file.type.startsWith('video/')) {
//     return VideoIcon({ className: 'text-white rounded-xl bg-gray-700' });
//   } else if (file.type.startsWith('audio/')) {
//     return AudioIcon({ className: 'p-1.5 h-6 text-white rounded-xl bg-blue-500' });
//   } else if (file.type.startsWith('text/')) {
//     return DocumentIcon({ className: 'p-1 h-6 text-white rounded-xl bg-blue-500' });
//   }

//   return RawIcon({ className: 'bg-gray-500 rounded-xl' });
// }

export type FileTypeIconProps = {
  file: FileMimeCheckPayload;
  size?: number;
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

export function FileTypeIcon({ file, size = 14 }: FileTypeIconProps) {
  const icon = getFileTypeIcon(file);

  return (
    <i
      style={{
        width: `${size / 6}rem`,
        height: `${size / 6}rem`,
        display: 'block',
      }}
    >
      <img src={icon} />
    </i>
  );
}
