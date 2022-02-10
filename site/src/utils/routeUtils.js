export function getURL(path) {
    return `${window.location.origin}${import.meta.env.DEV ? '/#' : ''}${path}`
}
