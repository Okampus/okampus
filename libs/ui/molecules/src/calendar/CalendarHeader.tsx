import GlobalContext from './GlobalContext';

import { useContext } from 'react';
import dayjs from 'dayjs';

import { ReactComponent as ChevronLeftIcon } from '@okampus/assets/svg/icons/outlined/back.svg';
import { ReactComponent as ChevronRightIcon } from '@okampus/assets/svg/icons/outlined/next.svg';

export default function CalendarHeader() {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  function handlePrevMonth() {
    console.log('prev month');
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    console.log('next month');
    setMonthIndex(monthIndex + 1);
  }
  function handleReset() {
    setMonthIndex(monthIndex === dayjs().month() ? monthIndex + Math.random() : dayjs().month());
  }
  return (
    <header className="px-4 py-2 flex items-center">
      {/* <img src={logo} alt="calendar" className="mr-2 w-12 h-12" /> */}
      <h1 className="mr-6 text-xl text-1 fond-bold">Calendrier</h1>
      <button
        onClick={handleReset}
        className="border border-color-1 rounded-lg py-2 px-4 mr-5 text-1 bg-opposite text-opposite"
      >
        Aujourd'hui
      </button>
      <button onClick={handlePrevMonth}>
        <span className="material-icons-outlined cursor-pointer text-2 mx-2">
          <ChevronLeftIcon />
        </span>
      </button>
      <button onClick={handleNextMonth}>
        <span className="material-icons-outlined cursor-pointer text-2 mx-2">
          <ChevronRightIcon />
        </span>
      </button>
      <h2 className="ml-4 text-xl text-2 font-bold">
        {dayjs(new Date(dayjs().year(), monthIndex)).format('MMMM YYYY')}
      </h2>
    </header>
  );
}
