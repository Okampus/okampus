import dayjs from 'dayjs';

export function getMonthMatrix(month = dayjs().month(), year = dayjs().year()) {
  month = Math.floor(month);
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 1 - firstDayOfTheMonth;
  if (currentMonthCount > 0) {
    currentMonthCount = -6 + currentMonthCount;
  }
  const daysMatrix = Array.from({ length: 6 })
    .fill([])
    .map(() => {
      return Array.from({ length: 7 })
        .fill(null)
        .map(() => {
          currentMonthCount++;
          return dayjs(new Date(year, month, currentMonthCount));
        });
    });
  return daysMatrix;
}
