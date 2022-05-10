export const DOCUMENTS = [
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
]

export const IMAGES = ['^image/(.)+']

export const AUDIO = ['^audio/(.)+']

export const VIDEO = ['^video/(.)+']
