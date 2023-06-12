import clsx from 'clsx';
import dayjs from 'dayjs';
import { formatHourSimple, getColorHexFromData } from '@okampus/shared/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@okampus/ui/atoms';
import { EventPopoverCard } from '@okampus/ui/molecules';

import type { EventBaseInfo } from '@okampus/shared/graphql';

type DayProps = { day: dayjs.Dayjs; isOtherMonth?: boolean; events: EventBaseInfo[] };
export function Day({ day, isOtherMonth, events }: DayProps) {
  function getCurrentDayClass() {
    return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
      ? 'bg-blue-600 text-white'
      : isOtherMonth
      ? 'text-3'
      : 'text-2';
  }

  const dayClass = isOtherMonth ? 'bg-3 opacity-80' : 'bg-1 shadow-inner shadow-[#fafafa] dark:shadow-[#070707]';
  const dayNumberClass =
    'rounded-xl h-[2.4rem] w-[2.5rem] my-2 mx-1.5 self-end flex justify-center items-center font-semibold';

  return (
    <div className={clsx(dayClass, 'flex flex-col')}>
      <header className={clsx(dayNumberClass, getCurrentDayClass())}>{day.format('DD')}</header>
      <div className="cursor-pointer pl-2">
        {events.map((event, idx) => (
          <Popover placementOffset={10} key={idx}>
            <PopoverTrigger>
              <div
                className="px-2 py-0.5 mr-3 rounded line-clamp-1 text-start text-xs text-white"
                style={{ backgroundColor: getColorHexFromData(event.contentMaster?.name) }}
              >
                <span className="text-gray-200 font-medium mr-1">{formatHourSimple(event.start as string)}</span>
                <span className="font-semibold">{event.contentMaster?.name}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <EventPopoverCard event={event} />
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
}
