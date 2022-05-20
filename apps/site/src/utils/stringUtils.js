export function isPositiveInteger(str) {
    const num = Number(str)
    return Number.isInteger(num) && num > 0
}

export function isNumeric(str) {
    if (typeof str != 'string') return false
    return !isNaN(str) && !isNaN(parseFloat(str))
}
