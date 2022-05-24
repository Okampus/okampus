import colors from '@/shared/assets/colors'

export const getColorFromData = (string) => {
    const hash = string.split('').reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0)
        return a & a
    }, 0)
    return colors[((hash % colors.length) + colors.length) % colors.length]
}
