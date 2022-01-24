export function camelToSentenceCase(camelStr) {
    const result = camelStr.replace(/([A-Z])/g, ' $1')
    return result.charAt(0).toUpperCase() + result.slice(1)
}
