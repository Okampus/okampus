export function isPositiveInteger(str) {
    const num = Number(str)
    return Number.isInteger(num) && num > 0
}
