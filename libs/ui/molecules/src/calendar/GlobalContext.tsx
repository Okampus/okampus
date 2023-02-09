/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';

import type { EventType, Label, ReduceEvent } from './types';
import type dayjs from 'dayjs';

const GlobalContext = React.createContext({
  monthIndex: 0 as number,
  setMonthIndex: (_index: number) => {},
  smallCalendarMonth: 0 as number,
  setSmallCalendarMonth: (_index: number) => {},
  selectedDate: null as dayjs.Dayjs | null,
  setSelectedDate: (_day: dayjs.Dayjs) => {},
  showEventModal: false,
  setShowEventModal: (_show: boolean) => {},
  dispatchCalEvent: ({ type: _type, payload: _payload }: ReduceEvent) => {},
  savedEvents: [] as EventType[],
  selectedEvent: null as EventType | null,
  setSelectedEvent: (_evt: EventType) => {},
  setLabels: (_labels: Label[]) => {},
  labels: [] as Label[],
  updateLabel: (_label: Label) => {},
  filteredEvents: [] as EventType[],
});

export default GlobalContext;
