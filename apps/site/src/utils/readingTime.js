const DEFAULT = 'medium'
export function readingTime(text, mode = DEFAULT) {
    const WPM = {
        slow: 130,
        medium: 200,
        fast: 260,
        veryFast: 400,
    }

    const words = text.trim().split(/\s+/).length
    const minutes = words / WPM?.[mode] ?? WPM[DEFAULT]
    return minutes * 60
}
