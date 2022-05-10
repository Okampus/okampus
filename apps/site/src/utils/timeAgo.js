export function timeAgo(dateString, style) {
    const date = dateString instanceof Date ? dateString : new Date(dateString)
    const formatter = new Intl.RelativeTimeFormat('fr', { style: style ?? 'short' })

    const ranges = {
        years: 3600 * 24 * 365,
        months: 3600 * 24 * 30,
        weeks: 3600 * 24 * 7,
        days: 3600 * 24,
        hours: 3600,
        minutes: 60,
        seconds: 1,
    }

    const secondsElapsed = parseInt((date.getTime() - Date.now()) / 1000)

    if (secondsElapsed >= -1) {
        // TODO: internationalize
        return "il y a moins d'une seconde"
    }

    for (const key in ranges) {
        if (ranges[key] < Math.abs(secondsElapsed)) {
            const delta = secondsElapsed / ranges[key]
            return formatter.format(Math.round(delta), key)
        }
    }
}
