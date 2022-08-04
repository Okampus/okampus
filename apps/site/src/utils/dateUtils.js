import { i18n } from '@/shared/modules/i18n'

export const getDateFromDatetime = (date) => new Date(date).toISOString().split('T')[0]

export function getTodayDate() {
    return getDateFromDatetime(new Date())
}

export function formatDateShort(dateString, weekday = false) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(i18n.global.locale.value, {
        ...(weekday ? { weekday: 'short' } : {}),
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }).format(date)
}

export function formatDateLong(dateString) {
    const date = new Date(dateString)
    return `${new Intl.DateTimeFormat(i18n.global.locale.value, {
        dateStyle: 'full',
        timeStyle: 'short',
    }).format(date)} ${new Intl.DateTimeFormat(i18n.global.locale.value, {
        timeZoneName: 'short',
    })
        .format(date)
        .slice(11)}`
}

export function getDateRangeStringShort(startDate, endDate, timeStyle = false) {
    const fullDateFormat = new Intl.DateTimeFormat(i18n.global.locale.value, {
        month: 'short',
        day: 'numeric',
        ...(timeStyle
            ? {
                  hour: 'numeric',
                  minute: 'numeric',
              }
            : {}),
    })

    return fullDateFormat.formatRange(new Date(startDate), new Date(endDate))
}

export function getDateRangeString(startDate, endDate, weekday = true) {
    const fullDateFormat = new Intl.DateTimeFormat(i18n.global.locale.value, {
        ...(weekday ? { weekday: 'short' } : {}),
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
        return { type: 'hours', value: hours }
    } else {
        return { type: 'days', value: Math.floor(hours / 24) }
    }
}
