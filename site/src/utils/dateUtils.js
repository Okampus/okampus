export const getDateFromDatetime = (date) => new Date(date).toISOString().split('T')[0]

export function getTodayDate() {
    return getDateFromDatetime(new Date())
}
