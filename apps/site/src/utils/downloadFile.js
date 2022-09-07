export const getObjectUrl = (blob) => URL.createObjectURL(blob)

export const download = (href, filename) => {
    const a = document.createElement('a')
    a.href = href
    a.download = filename
    a.click()
    a.remove()
}

export const downloadResource = (url, filename) => {
    if (!filename) filename = url.split('\\').pop().split('/').pop()
    fetch(url, {
        headers: new Headers({
            'Origin': location.origin,
        }),
        mode: 'cors',
    })
        .then((response) => response.blob())
        .then((blob) => download(getObjectUrl(blob), filename))
        .catch((e) => console.error(e))
}

export const downloadFile = (file, objectUrl = true) => {
    objectUrl ? download(getObjectUrl(file), file.name) : downloadResource(file.url, file.name)
}

export const downloadJSON = (object, filename) => {
    const dataSrc = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(object))
    download(dataSrc, filename + '.json')
}
