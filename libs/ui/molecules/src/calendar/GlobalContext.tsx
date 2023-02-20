/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';

import type { EventType, Label, ReduceEvent } from './types';
import type dayjs from 'dayjs';

type GlobalContextType = {
  monthIndex: number;
  setMonthIndex: (index: number) => void;
  smallCalendarMonth: number;
  setSmallCalendarMonth: (index: number) => void;
  selectedDate: dayjs.Dayjs | null;
  setSelectedDate: (day: dayjs.Dayjs) => void;
  showEventModal: boolean;
  setShowEventModal: (show: boolean) => void;
  dispatchCalEvent: (event: ReduceEvent) => void;
  savedEvents: EventType[];
  selectedEvent: EventType | null;
  setSelectedEvent: (evt: EventType) => void;
  setLabels: (labels: Label[]) => void;
  labels: Label[];
  updateLabel: (label: Label) => void;
  filteredEvents: EventType[];
};

const GlobalContext = React.createContext<GlobalContextType>({
  monthIndex: 0,
  setMonthIndex: () => {},
  smallCalendarMonth: 0,
  setSmallCalendarMonth: () => {},
  selectedDate: null,
  setSelectedDate: () => {},
  showEventModal: false,
  setShowEventModal: () => {},
  dispatchCalEvent: () => {},
  savedEvents: [],
  selectedEvent: null,
  setSelectedEvent: () => {},
  setLabels: () => {},
  labels: [],
  updateLabel: () => {},
  filteredEvents: [],
});

export default GlobalContext;
