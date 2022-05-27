export function getURL(path) {
    return `${window.location.origin}${import.meta.env.DEV ? '/#' : ''}${path}`
}

export function getCurrentPath() {
    return import.meta.env.DEV ? window.location.hash.slice(1) : window.location.pathname
}
