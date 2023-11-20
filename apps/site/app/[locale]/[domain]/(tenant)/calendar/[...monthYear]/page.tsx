import SidebarTitle from '../../../../../_components/layouts/SideBar/SidebarTitle';
import Sidebar from '../../../../../_components/layouts/Sidebar';

import CalendarSidebar from '../../../../../_views/Calendar/CalendarSidebar';
import CalendarView from '../../../../../_views/Calendar/CalendarView';

import prisma from '../../../../../../database/prisma/db';

import { eventMinimal } from '../../../../../../types/prisma/Event/event-minimal';

import { EventState } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function generateStaticParams() {
  const now = new Date();
  const params = [];

  for (let year = now.getFullYear(); year <= now.getFullYear() + 1; year++) {
    for (let month = now.getMonth(); month <= 11; month++) {
      params.push({ params: { year: year.toString(), month: month.toString().padStart(2, '0') } });
    }
  }

  return params;
}

export type CalendarParams = { params: { lang: string; domain: string; monthYear: string[] } };

export default async function CalendarPage({ params }: CalendarParams) {
  const year = Number.parseInt(params.monthYear.at(0) || '');
  const month = Number.parseInt(params.monthYear.at(1) || '');

  if (params.monthYear.length > 2) redirect(`/calendar/${year}/${month}`);
  if (Number.isNaN(year) || Number.isNaN(month) || month > 12 || month < 1 || year < 2023 || year > 2100)
    redirect('/calendar');
  if (month < 10 && params.monthYear.at(1)?.length === 1) redirect(`/calendar/${year}/0${month}`);

  const events = await prisma.event.findMany({
    select: eventMinimal.select,
    where: {
      start: { gte: new Date(year, month - 1, 1), lte: new Date(year, month, 1) },
      state: EventState.Published,
    },
  });

  return (
    <>
      <Sidebar>
        <SidebarTitle>Calendrier</SidebarTitle>
        <CalendarSidebar month={month} year={year} />
      </Sidebar>
      <CalendarView events={events} monthYear={[month, year]} />
    </>
  );
}
