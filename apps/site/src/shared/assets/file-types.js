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
    '.pdf',
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
// TODO: improve typename by showing extension instead of typename in some cases
export const FILE_TYPES = {
    [ARCHIVE]: {
        subtypes: {
            [RAR]: {
                condition: (filename, mime) =>
                    RAR_EXTS.some((ext) => filename.endsWith(ext)) || RAR_MIMES.includes(mime),
                icon: 'fa fa-book',
                text: 'Archive RAR',
                color: 'bg-fuschia-700',
                type: RAR,
                typeName: 'RAR',
                parentType: ARCHIVE,
            },
            [ZIP]: {
                condition: (filename, mime) =>
                    ZIP_EXTS.some((ext) => filename.endsWith(ext)) || ZIP_MIMES.includes(mime),
                icon: 'fa fa-file-zipper',
                text: 'Archive ZIP',
                color: 'bg-yellow-400',
                type: ZIP,
                typeName: 'ZIP',
                parentType: ARCHIVE,
            },
            [OTHER_ARCHIVE]: {
                condition: () => true,
                icon: 'fa fa-file-archive',
                text: 'Archive',
                color: 'bg-yellow-400',
                type: OTHER_ARCHIVE,
                typeName: 'Archive',
                parentType: ARCHIVE,
            },
        },
        condition: (filename, mime, meta) =>
            (meta && meta === ARCHIVE) || (!meta && ARCHIVE_EXTS.some((ext) => filename.endsWith(ext))),
        text: 'Archive',
        allowedString: 'Archive (ZIP, RAR...)',
        icon: 'fa fa-box-archive',
        color: 'bg-yellow-400',
        type: ARCHIVE,
        typeName: 'Archive',
    },
    [AUDIO]: {
        subtypes: {
            [MIDI]: {
                condition: (filename) => MIDI_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-music',
                text: 'Audio MIDI',
                color: 'bg-blue-400',
                type: MIDI,
                typeName: 'MIDI',
                parentType: AUDIO,
            },
            [RAW_AUDIO]: {
                condition: (filename) => RAW_AUDIO_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-file-audio',
                text: 'Audio RAW',
                color: 'bg-blue-400',
                type: RAW_AUDIO,
                typeName: 'RAW',
                parentType: AUDIO,
            },
            [COMPRESSED_AUDIO]: {
                condition: (filename) => COMPRESSED_AUDIO_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-file-audio',
                text: 'Audio Compressé',
                color: 'bg-blue-400',
                type: COMPRESSED_AUDIO,
                typeName: 'MP3',
                parentType: AUDIO,
            },
            [OTHER_AUDIO]: {
                condition: () => true,
                icon: 'fa fa-music',
                text: 'Fichier Audio',
                color: 'bg-blue-400',
                type: OTHER_AUDIO,
                typeName: 'Audio',
                parentType: AUDIO,
            },
        },
        condition: (filename, mime, meta) =>
            (meta && meta === AUDIO) ||
            (!meta && (/^audio\/(.)+$/.test(mime) || AUDIO_EXTS.some((ext) => filename.endsWith(ext)))),
        text: 'Audio',
        allowedString: 'Audio (MP3, M4A, MIDI...)',
        icon: 'fa fa-headphones',
        color: 'bg-blue-400',
        type: AUDIO,
        typeName: 'Audio',
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
                type: MARKDOWN,
                typeName: 'Markdown',
                parentType: DOCUMENT,
            },
            [CODE]: {
                condition: (filename) =>
                    CODE_EXTS.some((ext) => filename.endsWith(ext) || filename === 'dockerfile'),
                icon: 'fa fa-code',
                text: 'Code source',
                color: 'bg-emerald-500',
                type: CODE,
                typeName: 'Code',
                parentType: DOCUMENT,
            },
            [LATEX]: {
                condition: (filename) => LATEX_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-square-root-variable',
                text: 'LaTeX',
                color: 'bg-gray-500',
                type: LATEX,
                typeName: 'LaTeX',
                parentType: DOCUMENT,
            },
            [RICH_DOCUMENT]: {
                condition: (filename) => RICH_DOCUMENT_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-file-word',
                text: 'Document',
                color: 'bg-blue-500',
                type: RICH_DOCUMENT,
                typeName: 'DOC',
                parentType: DOCUMENT,
            },
            [PRESENTATION]: {
                condition: (filename) => PRESENTATION_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-file-powerpoint',
                text: 'Présentation',
                color: 'bg-orange-700',
                type: PRESENTATION,
                typeName: 'PPT',
                parentType: DOCUMENT,
            },
            [PLAIN]: {
                condition: () => true,
                icon: 'fa fa-file-lines',
                text: 'Texte',
                color: 'bg-gray-500',
                type: PLAIN,
                typeName: 'TXT',
                parentType: DOCUMENT,
            },
        },
        condition: (filename, mime, meta) =>
            (meta && meta === DOCUMENT) ||
            (!meta && (/^text\/(.)+$/.test(mime) || DOCUMENT_EXTS.some((ext) => filename.endsWith(ext)))),
        icon: 'fa fa-file-alt',
        allowedString: 'Document (TXT, DOC, PPT, PDF, LaTeX...)',
        color: 'bg-gray-500',
        type: DOCUMENT,
        typeName: 'DOC',
    },
    [FOLDER]: {
        condition: (filename, mime, meta) =>
            (meta && meta === FOLDER) || (!meta && FOLDER_MIMES.includes(mime)),
        text: 'Dossier',
        allowedString: 'Dossier',
        icon: 'fa fa-folder',
        color: 'bg-black',
        type: FOLDER,
        typeName: 'Dossier',
    },
    [FORM]: {
        subtypes: {
            [FORMKIT]: {
                condition: (filename, mime, meta) => meta === FORMKIT,
                icon: 'fa fa-list',
                text: 'Formulaire',
                color: 'bg-purple-700',
                type: FORMKIT,
                typeName: 'Formulaire',
                parentType: FORM,
            },
            [FORMKIT_TEMPLATE]: {
                condition: (filename, mime, meta) => meta === FORMKIT_TEMPLATE,
                icon: 'fa fa-clipboard-list',
                text: 'Modèle de formulaire',
                color: 'bg-purple-900',
                type: FORMKIT_TEMPLATE,
                typeName: 'Modèle',
                parentType: FORM,
            },
        },
        condition: (filename, mime, meta) => [FORMKIT, FORMKIT_TEMPLATE].includes(meta),
        text: 'Formulaire',
        allowedString: 'Formulaire',
        icon: 'fa fa-list',
        color: 'bg-purple-700',
        type: FORM,
        typeName: 'Form',
    },
    [IMAGE]: {
        subtypes: {
            [VECTOR]: {
                condition: (filename) => VECTOR_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-bezier-curve',
                text: 'Image vectorielle',
                color: 'bg-black',
                type: VECTOR,
                typeName: 'SVG',
                parentType: IMAGE,
            },
            [ANIMATED]: {
                condition: (filename) => ANIMATED_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-images',
                text: 'Image animée',
                color: 'bg-black',
                type: ANIMATED,
                typeName: 'GIF',
                parentType: IMAGE,
            },
            [RASTER]: {
                condition: (filename) => RASTER_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-image',
                text: 'Image',
                color: 'bg-black',
                type: RASTER,
                typeName: 'IMG',
                parentType: IMAGE,
            },
        },
        condition: (filename, mime, meta) =>
            (meta && meta === IMAGE) ||
            (!meta && (/^image\/(.)+$/.test(mime) || IMAGE_EXTS.some((ext) => filename.endsWith(ext)))),
        text: 'Image',
        allowedString: 'Images (SVG, JPG, PNG...)',
        icon: 'fa fa-image',
        color: 'bg-black',
        type: IMAGE,
        typeName: 'IMG',
    },
    [TABLE]: {
        subtypes: {
            [SIMPLE_TABLE]: {
                condition: (filename) => SIMPLE_TABLE_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-file-csv',
                text: 'Tableur',
                color: 'bg-green-700',
                type: SIMPLE_TABLE,
                typeName: 'CSV',
                parentType: TABLE,
            },
            [RICH_TABLE]: {
                condition: (filename) => RICH_TABLE_EXTS.some((ext) => filename.endsWith(ext)),
                icon: 'fa fa-table',
                text: 'Tableur Riche',
                color: 'bg-green-800',
                type: RICH_TABLE,
                typeName: 'Tableur',
                parentType: TABLE,
            },
            [FORM_RESULTS]: {
                condition: (filename, mime, meta) => meta === FORM_RESULTS,
                icon: 'fa fa-table-list',
                text: 'Résultats de formulaire',
                color: 'bg-purple-600',
                type: FORM_RESULTS,
                typeName: 'FormCsv',
                parentType: TABLE,
            },
        },
        condition: (filename, mime, meta) =>
            (meta && [TABLE, FORM_RESULTS].includes(meta)) ||
            (!meta && TABLE_EXTS.some((ext) => filename.endsWith(ext))),
        text: 'Tableau',
        allowedString: 'Tableur (CSV, XLS(X), SQLITE...)',
        icon: 'fa fa-photo-film',
        color: 'bg-green-800',
        type: TABLE,
        typeName: 'Tableau',
    },
    [VIDEO]: {
        condition: (filename, mime, meta) =>
            (meta && meta === VIDEO) ||
            (!meta && (/^audio\/(.)+$/.test(mime) || AUDIO_EXTS.some((ext) => filename.endsWith(ext)))),
        text: 'Vidéo',
        allowedString: 'Vidéo (MP4, AVI, WEBM...)',
        icon: 'fa fa-film',
        color: 'bg-red-500',
        type: VIDEO,
        typeName: 'Vidéo',
    },
    [ANY]: {
        condition: () => true,
        text: 'Fichier',
        allowedString: 'Tout type de fichier',
        icon: 'fa fa-file',
        color: 'bg-gray-500',
        type: ANY,
        typeName: 'Fichier',
    },
}

export const testCondition = (condition, file) =>
    condition(file.name?.toLowerCase() ?? '', file.type ?? file.mimeType ?? file.mime, file.meta)

export const findType = (file) => {
    if (!isEmpty(file.fileType))
        return file.fileType in FILE_TYPES
            ? file.fileType
            : Object.entries(FILE_TYPES).find(([, { subtypes }]) => subtypes && file.fileType in subtypes)[0]

    for (const [type, { condition }] of Object.entries(FILE_TYPES)) {
        if (testCondition(condition, file)) return type
    }
    return ANY
}

export const findSubtype = (file, returnJson = false) => {
    const type = findType(file)
    if (type === ANY) return returnJson ? FILE_TYPES[ANY] : ANY
    const { subtypes } = FILE_TYPES[type]
    for (const [subtypeType, subtype] of Object.entries(subtypes)) {
        if (subtypeType === file.fileType || testCondition(subtype.condition, file))
            return returnJson ? subtype : subtypeType
    }
    return returnJson ? FILE_TYPES[type] : type
}

export const getType = (file) => findSubtype(file, true)
