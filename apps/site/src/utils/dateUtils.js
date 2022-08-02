import { i18n } from '@/shared/modules/i18n'

export const getDateFromDatetime = (date) => new Date(date).toISOString().split('T')[0]

export function getTodayDate() {
    return getDateFromDatetime(new Date())
}

export function formatDateLong(dateString) {
    const date = new Date(dateString)
    return `${new Intl.DateTimeFormat(i18n.global.locale, {
        dateStyle: 'full',
        timeStyle: 'short',
    }).format(date)} ${new Intl.DateTimeFormat(i18n.global.locale, {
        timeZoneName: 'short',
    })
        .format(date)
        .slice(11)}`
}

export function getDateRangeString(startDate, endDate) {
    const fullDateFormat = new Intl.DateTimeFormat(i18n.global.locale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    })

    return fullDateFormat.formatRange(new Date(startDate), new Date(endDate))
}

export function getCountdown(startDate, endDate) {
    const hours = Math.abs(endDate - startDate) / 3600000
    if (hours < 72) {
        return `H-${parseInt(hours)}`
    } else {
        return `J-${parseInt(hours / 24)}`
    }
}
