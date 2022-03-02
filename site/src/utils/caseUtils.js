export function camelToSentenceCase(camelStr) {
    const result = camelStr.replace(/([A-Z])/g, ' $1')
    return result.charAt(0).toUpperCase() + result.slice(1)
}

export function camelToKebabCase(camelStr) {
    const result = camelStr.replace(/([A-Z])/g, '-$1').toLowerCase()
    return result.charAt(0).toLowerCase() + result.slice(1)
}
