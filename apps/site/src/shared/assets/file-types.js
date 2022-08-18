import { isEmpty } from 'lodash'
import { ALL_CODE_EXTS } from './code-exts'

export const ANY = 'File'

export const ARCHIVE = 'Archive'

export const RAR = 'RAR'
export const RAR_MIMES = [
    'application/x-rar-compressed',
    'application/rar',
    'application/x-rar',
    'application/vnd.rar',
]
export const RAR_EXTS = ['.rar']

export const ZIP = 'ZIP'
export const ZIP_MIMES = ['application/zip']
export const ZIP_EXTS = ['.7z', '.zip', '.zipx']

export const ARCHIVE_EXTS = [
    ...RAR_EXTS,
    ...ZIP_EXTS,
    '.apk',
    '.dmg',
    '.gz',
    '.jar',
    '.tar',
    '.tar.gz',
    '.tgz',
    '.tar.Z',
    '.tar.bz2',
    '.tbz2',
    '.tar.lz',
    '.tlz',
    '.tar.xz',
    '.txz',
    '.tar.zst',
]

export const OTHER_ARCHIVE = 'OtherArchive'

export const AUDIO = 'Audio'

export const MIDI = 'Midi'
export const MIDI_EXTS = ['.mid', '.midi']

export const RAW_AUDIO = 'RawAudio'
export const RAW_AUDIO_EXTS = ['.aiff', '.au', '.l16', '.wav', '.pcm']

export const COMPRESSED_AUDIO = 'CompressedAudio'
export const COMPRESSED_AUDIO_EXTS = ['.aac', '.ape', '.caf', '.flac', '.m4a', '.mp3', '.ogg', '.wma', '.wv']

export const OTHER_AUDIO = 'OtherAudio'

export const AUDIO_EXTS = [...MIDI_EXTS, ...RAW_AUDIO_EXTS, ...COMPRESSED_AUDIO_EXTS]

export const DOCUMENT = 'Document'

export const MARKDOWN = 'Markdown'
export const MARKDOWN_EXTS = ['.md', '.markdown', '.mkd']

export const CODE = 'Code'
export const CODE_EXTS = ALL_CODE_EXTS

export const LATEX = 'LaTeX'
export const LATEX_EXTS = ['.tex', '.latex']

export const RICH_DOCUMENT = 'RichDocument'
export const RICH_DOCUMENT_EXTS = [
    '.doc',
    '.docx',
    '.odt',
    '.out',
    '.fodt',
    '.pages',
    '.rtf',
    '.wpd',
    '.wps',
    '.epub',
    '.xps',
]

export const PRESENTATION = 'Presentation'
export const PRESENTATION_EXTS = [
    '.ppt',
    '.pptx',
    '.pps',
    '.ppsx',
    '.pptm',
    '.ppsm',
    '.pot',
    '.potx',
    '.potm',
    '.odp',
]

export const PLAIN = 'Plain'

export const DOCUMENT_EXTS = [...MARKDOWN_EXTS, ...CODE_EXTS, ...RICH_DOCUMENT_EXTS, ...PRESENTATION_EXTS]

export const FOLDER = 'Folder'
export const FOLDER_MIMES = ['inode/directory', 'application/x-directory']

export const FORM = 'Form'

export const FORMKIT_TEMPLATE = 'FormKitTemplate'
export const FORMKIT = 'FormKit'

export const IMAGE = 'Image'

export const VECTOR = 'Vector'
export const VECTOR_EXTS = ['.ai', '.eps', '.ps', '.svg']

export const ANIMATED = 'Animated'
export const ANIMATED_EXTS = ['.gif', '.avif', '.apng', '.webp', '.flif', '.mng']

export const RASTER = 'Raster'
export const RASTER_EXTS = ['.bmp', '.ico', '.jpeg', '.jpg', '.png', '.tiff']

export const IMAGE_EXTS = [...VECTOR_EXTS, ...ANIMATED_EXTS, ...RASTER_EXTS]

export const TABLE = 'Table'

export const SIMPLE_TABLE = 'CSV'
export const SIMPLE_TABLE_EXTS = ['.csv', '.tsv', '.tab', '.dif']

export const RICH_TABLE = 'RichTable'
export const RICH_TABLE_EXTS = ['.xls', '.xlsx', '.ods', '.ots']

export const TABLE_EXTS = [...SIMPLE_TABLE_EXTS, ...RICH_TABLE_EXTS]

export const FORM_RESULTS = 'FormResults'

export const VIDEO = 'Video'
export const VIDEO_EXTS = ['.avi', '.flv', '.mkv', '.mov', '.mp4', '.mpeg', '.mpg', '.ogv', '.webm']

// !! Conditions are match first !!
export const FILE_TYPES = {
    [ARCHIVE]: {
        subtypes: {
            [RAR]: {
                condition: (filename, mime) =>
                    RAR_EXTS.some((ext) => filename.endsWith(ext)) || RAR_MIMES.includes(mime),
                icon: 'fa fa-book',
                text: 'Archive RAR',
                color: 'bg-fuschia-700',
                type: 'RAR',
            },
            [ZIP]: {
                condition: (filename, mime) =>
                    ZIP_EXTS.some((ext) => filename.endsWith(ext)) || ZIP_MIMES.includes(mime),
                icon: 'fa fa-file-zipper',
                text: 'Archive ZIP',
                color: 'bg-yellow-400',
                type: 'ZIP',
            },
            [OTHER_ARCHIVE]: {
                condition: () => true,
                icon: 'fa fa-file-archive',
                text: 'Archive',
                color: 'bg-yellow-400',
                type: 'ARCHIVE',
            },
        },
        condition: (filename, mime, meta) =>
            (meta && meta === ARCHIVE) || (!meta && ARCHIVE_EXTS.some((ext) => filename.endsWith(ext))),
        text: 'Archive',
        allowedString: 'Archive (ZIP, RAR...)',
        icon: 'fa fa-box-archive',
        color: 'bg-yellow-400',
        type: 'AUDIO',
    },
    [AUDIO]: {
        subtypes: {
            [MIDI]: {
                condition: (filename) => MIDI_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-music',
                text: 'Audio MIDI',
                color: 'bg-blue-400',
                type: 'MIDI',
            },
            [RAW_AUDIO]: {
                condition: (filename) => RAW_AUDIO_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-file-audio',
                text: 'Audio RAW',
                color: 'bg-blue-400',
                type: 'RAW',
            },
            [COMPRESSED_AUDIO]: {
                condition: (filename) => COMPRESSED_AUDIO_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-file-audio',
                text: 'Audio Compressé',
                color: 'bg-blue-400',
                type: 'MP3',
            },
            [OTHER_AUDIO]: {
                condition: () => true,
                icon: 'fa fa-music',
                text: 'Fichier Audio',
                color: 'bg-blue-400',
                type: 'AUDIO',
            },
        },
        condition: (filename, mime, meta) =>
            (meta && meta === AUDIO) ||
            (!meta && (/^audio\/(.)+$/.test(mime) || AUDIO_EXTS.some((ext) => filename.endsWith(ext)))),
        text: 'Audio',
        allowedString: 'Audio (MP3, M4A, MIDI...)',
        icon: 'fa fa-headphones',
        color: 'bg-blue-400',
        type: 'AUDIO',
    },
    [DOCUMENT]: {
        subtypes: {
            // TODO: HTML should be given a special option to render (WITH FULL XSS PROTECTION)
            [MARKDOWN]: {
                condition: (filename, mime) =>
                    CODE_EXTS.some((ext) => filename.endsWith(ext) || mime === 'text/markdown'),
                icon: 'fa fa-markdown',
                text: 'Markdown',
                color: 'bg-black',
                type: 'MKDOWN',
            },
            [CODE]: {
                condition: (filename) =>
                    CODE_EXTS.some((ext) => filename.endsWith(ext) || filename === 'dockerfile'),
                icon: 'fa fa-code',
                text: 'Code source',
                color: 'bg-emerald-500',
                type: 'CODE',
            },
            [LATEX]: {
                condition: (filename) => LATEX_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-square-root-variable',
                text: 'LaTeX',
                color: 'bg-grey-500',
                type: 'LaTeX',
            },
            [RICH_DOCUMENT]: {
                condition: (filename) => RICH_DOCUMENT_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-file-word',
                text: 'Document',
                color: 'bg-blue-500',
                type: 'WORD',
            },
            [PRESENTATION]: {
                condition: (filename) => PRESENTATION_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-file-powerpoint',
                text: 'Présentation',
                color: 'bg-orange-700',
                type: 'PPT',
            },
            [PLAIN]: {
                condition: () => true,
                icon: 'fa fa-file-lines',
                text: 'Texte',
                color: 'bg-grey-500',
                type: 'TXT',
            },
        },
        condition: (filename, mime, meta) =>
            (meta && meta === DOCUMENT) ||
            (!meta && (/^text\/(.)+$/.test(mime) || DOCUMENT_EXTS.some((ext) => filename.endsWith(ext)))),
        icon: 'fa fa-file-alt',
        allowedString: 'Document (Texte, DOC(X), PPT(X), PDF, Code source, LaTeX...)',
        color: 'bg-grey-500',
        type: 'DOC',
    },
    [FOLDER]: {
        condition: (filename, mime, meta) =>
            (meta && meta === FOLDER) || (!meta && FOLDER_MIMES.includes(mime)),
        text: 'Dossier',
        allowedString: 'Dossier',
        icon: 'fa fa-folder',
        color: 'bg-black',
        type: 'FOLDER',
    },
    [FORM]: {
        subtypes: {
            [FORMKIT]: {
                condition: (filename, mime, meta) => meta === FORMKIT,
                icon: 'fa fa-list',
                text: 'Formulaire',
                color: 'bg-purple-700',
                type: 'FORM',
            },
            [FORMKIT_TEMPLATE]: {
                condition: (filename, mime, meta) => meta === FORMKIT_TEMPLATE,
                icon: 'fa fa-clipboard-list',
                text: 'Modèle de formulaire',
                color: 'bg-purple-900',
                type: 'FORM_BASE',
            },
        },
        condition: (filename, mime, meta) => [FORMKIT, FORMKIT_TEMPLATE].includes(meta),
        text: 'Formulaire',
        allowedString: 'Formulaire',
        icon: 'fa fa-list',
        color: 'bg-purple-700',
        type: 'FORM',
    },
    [IMAGE]: {
        subtypes: {
            [VECTOR]: {
                condition: (filename) => VECTOR_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-bezier-curve',
                text: 'Image vectorielle',
                color: 'bg-black',
                type: 'SVG',
            },
            [ANIMATED]: {
                condition: (filename) => ANIMATED_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-images',
                text: 'Image animée',
                color: 'bg-black',
                type: 'GIF',
            },
            [RASTER]: {
                condition: (filename) => RASTER_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-image',
                text: 'Image',
                color: 'bg-black',
                type: 'IMG',
            },
        },
        condition: (filename, mime, meta) =>
            (meta && meta === IMAGE) ||
            (!meta && (/^image\/(.)+$/.test(mime) || IMAGE_EXTS.some((ext) => filename.endsWith(ext)))),
        text: 'Image',
        allowedString: 'Images (SVG, JPG, PNG...)',
        icon: 'fa fa-image',
        color: 'bg-black',
        type: 'IMG',
    },
    [TABLE]: {
        subtypes: {
            [SIMPLE_TABLE]: {
                condition: (filename) => SIMPLE_TABLE_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-file-csv',
                text: 'Tableur',
                color: 'bg-green-700',
                type: 'CSV',
            },
            [RICH_TABLE]: {
                condition: (filename) => RICH_TABLE_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-table',
                text: 'Tableur Riche',
                color: 'bg-green-800',
                type: 'XLS',
            },
            [FORM_RESULTS]: {
                condition: (filename, mime, meta) => meta === FORM_RESULTS,
                icon: 'fa fa-table-list',
                text: 'Résultats de formulaire',
                color: 'bg-purple-600',
                type: 'FORM_CSV',
            },
        },
        condition: (filename, mime, meta) =>
            (meta && [TABLE, FORM_RESULTS].includes(meta)) ||
            (!meta && TABLE_EXTS.some((ext) => filename.endsWith(ext))),
        text: 'Tableau',
        allowedString: 'Tableur (CSV, XLS(X), SQLITE...)',
        icon: 'fa fa-photo-film',
        color: 'bg-green-800',
        type: 'TABLE',
    },
    [VIDEO]: {
        condition: (filename, mime, meta) =>
            (meta && meta === VIDEO) ||
            (!meta && (/^audio\/(.)+$/.test(mime) || AUDIO_EXTS.some((ext) => filename.endsWith(ext)))),
        text: 'Vidéo',
        allowedString: 'Vidéo (MP4, AVI, WEBM...)',
        icon: 'fa fa-film',
        color: 'bg-red-500',
        type: 'VIDEO',
    },
    [ANY]: {
        condition: () => true,
        text: 'Fichier',
        allowedString: 'Tout type de fichier',
        icon: 'fa fa-file',
        color: 'bg-grey-300',
        type: 'FILE',
    },
}

export const findType = (file) => {
    if (!isEmpty(file.type))
        return file.type in FILE_TYPES
            ? file.type
            : Object.entries(FILE_TYPES).find(([, { subtypes }]) => subtypes && file.type in subtypes)[0]

    for (const [type, { condition }] of Object.entries(FILE_TYPES)) {
        if (condition(file.name, file.mime, file.meta)) return type
    }
    return ANY
}

export const findSubtype = (file, returnJson = false) => {
    const type = findType(file)
    if (type === ANY) return returnJson ? FILE_TYPES[ANY] : ANY
    const { subtypes } = FILE_TYPES[type]
    for (const [subtype, { condition }] of Object.entries(subtypes)) {
        if (condition(file.name, file.mime ?? file.mimeType, file.meta))
            return returnJson ? FILE_TYPES[subtype] : subtype
    }
    return returnJson ? FILE_TYPES[type] : type
}

export const getType = (file) => findSubtype(file, true)
