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
        .then((blob) => {
            let blobUrl = URL.createObjectURL(blob)
            download(blobUrl, filename)
        })
        .catch((e) => console.error(e))
}

export const downloadFile = (file, objectUrl = true) => {
    objectUrl ? download(URL.createObjectURL(file), file.name) : downloadResource(file.url, file.name)
}
