enum StartDay {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export function getCalendar(month: number, year: number, startDay: StartDay = StartDay.Monday): number[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const calendar: number[][] = [];
  let week: number[] = [];

  const startingDay = (firstDay.getDay() - startDay + 7) % 7;

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  let prevMonthDay = prevMonthLastDay - startingDay + 1;

  for (let i = 0; i < startingDay; i++) {
    week.push(prevMonthDay);
    prevMonthDay++;
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    week.push(day);

    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }

  let nextMonthDay = 1;
  for (let i = week.length; i < 7; i++) {
    week.push(nextMonthDay);
    nextMonthDay++;
  }

  if (week.length > 0) calendar.push(week);
  while (calendar.length < 6) {
    week = [];
    const lastDay = calendar.at(-1)?.at(-1) ?? 0;
    for (let i = 0; i < 7; i++) week.push(lastDay + i + 1);
    calendar.push(week);
  }

  return calendar;
}
