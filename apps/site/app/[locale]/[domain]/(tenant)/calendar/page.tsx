import { redirect } from 'next/navigation';

export default async function RedirectToCalendarPage() {
  const now = new Date();
  const [month, year] = [now.getMonth() + 1, now.getFullYear()];

  redirect(`/calendar/${year}/${month.toString().padStart(2, '0')}`);
}
