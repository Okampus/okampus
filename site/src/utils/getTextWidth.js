export function getTextWidth(text, font) {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
    const context = canvas.getContext('2d')
    context.font = font
    const metrics = context.measureText(text)
    return metrics.width
}

export function getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop)
}

export function getCanvasFontSize(el = document.body) {
    const fontWeight = getCssStyle(el, 'font-weight') || 'normal'
    const fontSize = getCssStyle(el, 'font-size') || '16px'
    const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman'

    return `${fontWeight} ${fontSize} ${fontFamily}`
}

export function getTextWidthInElement(text, element) {
    return getTextWidth(text, getCanvasFontSize(element))
}
