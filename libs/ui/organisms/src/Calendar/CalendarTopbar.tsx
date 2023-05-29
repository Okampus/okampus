import { ArrowButton } from '@okampus/ui/atoms';
import { NavigationContext } from '@okampus/ui/hooks';
import { ActionButton } from '@okampus/ui/molecules';

import dayjs from 'dayjs';

import { useContext, useEffect } from 'react';

export type CalendarTopbarProps = {
  monthYear: [number, number];
  setMonthYear: (monthYear: [number, number]) => void;
  showInTopbar?: boolean;
};
export function CalendarTopbar({ monthYear, setMonthYear, showInTopbar }: CalendarTopbarProps) {
  const { setTopbar, setIsTopbarAlwaysShown } = useContext(NavigationContext);

  const now = dayjs();

  const [month, year] = monthYear;
  const previousMonthYear = (month === 0 ? [11, year - 1] : [month - 1, year]) as [number, number];
  const nextMonthYear = (month === 11 ? [0, year + 1] : [month + 1, year]) as [number, number];

  // const buttonClass = 'h-10 w-10 py-2 rounded-[50%] bg-main';
  const topbar = (
    <header className="flex items-center justify-between px-6">
      {/* <img src={logo} alt="calendar" className="mr-2 w-12 h-12" /> */}
      <div className="flex items-center gap-6">
        <div className="flex gap-4 opacity-80">
          <ArrowButton direction="left" onClick={() => setMonthYear(previousMonthYear)} />
          <ArrowButton direction="right" onClick={() => setMonthYear(nextMonthYear)} />
        </div>
        <h2 className="title capitalize">{dayjs(new Date(year, month)).format('MMMM YYYY')}</h2>
      </div>

      <ActionButton
        action={{
          label: "Aujourd'hui",
          linkOrActionOrMenu: () => setMonthYear([now.month(), now.year()]),
        }}
      />
      {/* <button
        onClick={() => setMonthYear([now.month(), now.year()])}
        className="border border-color-1 rounded-lg px-4 text-1 bg-opposite text-opposite"
      >
        Aujourd'hui
      </button> */}
    </header>
  );

  useEffect(() => {
    if (showInTopbar) {
      setTopbar(topbar);
      setIsTopbarAlwaysShown(true);
    }
  }, [showInTopbar, monthYear]);

  useEffect(() => () => (setTopbar(null), setIsTopbarAlwaysShown(false)), []);

  return showInTopbar ? null : topbar;
  // return showInTopbar ? topbarContentVisible && createPortal(topbar, topbarContentVisible) : topbar;
}
