export const ANY = 'File'
export const DOCUMENT = 'Document'
export const IMAGE = 'Image'
export const IMAGE_ANIM = 'ImageAnim'
export const AUDIO = 'Audio'
export const VIDEO = 'Video'

export const FILE_TYPES = {
    [ANY]: {
        mimes: ['.*'],
        mimeString: 'Toutes les extensions',
        icon: 'fa fa-file',
    },
    [DOCUMENT]: {
        mimes: [
            '^text/(.)+',
            '^model/(.)+',
            '^font/(.)+',
            '^application/msword',
            '^application/xml',
            '^application/json',
            '^application/pdf',
            String.raw`^application/vnd\.oasis\.opendocument\.presentation`,
            String.raw`^application/vnd\.oasis\.opendocument\.spreadsheet`,
            String.raw`^application/vnd\.oasis\.opendocument\.text`,
            String.raw`^application/vnd\.ms-powerpoint`,
            String.raw`^application/vnd\.openxmlformats-officedocument\.presentationml\.presentation`,
            String.raw`^application/vnd\.ms-excel`,
            String.raw`^application/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet`,
            String.raw`^application/vnd\.openxmlformats-officedocument\.wordprocessingml\.document`,
        ],
        mimeString: 'TXT, CSV, PDF, DOC(X), XLS(X), PPT(X), ODP, ODS, ODT',
        icon: 'fa fa-file',
    },
    [IMAGE]: {
        mimes: ['image/svg+xml', 'image/jpeg', 'image/png'],
        mimeString: 'SVG, JPG, PNG',
        icon: 'fa fa-image',
    },
    [IMAGE_ANIM]: {
        mimes: ['image/svg+xml', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        mimeString: 'SVG, JPG, PNG, GIF, WEBP',
        icon: 'fa fa-photo-film',
    },
    [AUDIO]: {
        mimes: ['audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/webm'],
        mimeString: 'MP3, OGG, WAV, WEBA',
        icon: 'fa fa-music',
    },
    [VIDEO]: {
        mimes: ['video/mp4', 'video/x-msvideo', 'video/mpeg', 'video/ogg', 'video/webm'],
        mimeString: 'MP4, AVI, MPEG, OGG, WEBM',
        icon: 'fa fa-film',
    },
}
