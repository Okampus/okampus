export function readingTimeMinutes(text) {
    const wpm = 225
    const words = text.trim().split(/\s+/).length
    const minutes = Math.ceil(words / wpm)
    return minutes
}
