'use client';

import CalendarInput from '../../_components/molecules/Input/Controlled/Date/CalendarInput';
import { useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

export type CalendarSidebarProps = { month: number; year: number };
export default function CalendarSidebar({ month, year }: CalendarSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const now = new Date();

  const initialDate = now.getFullYear() === year && now.getMonth() === month - 1 ? now : new Date(year, month - 1, 1);
  const [date, setDate] = useState<Date>(initialDate);

  return (
    <CalendarInput
      className="w-full pl-3 pr-1.5 mt-2"
      value={date}
      onChange={(date) => {
        setDate(date);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const path = `/calendar/${year}/${month.toString().padStart(2, '0')}`;
        if (pathname !== path) router.push(path);
      }}
    />
  );
}
