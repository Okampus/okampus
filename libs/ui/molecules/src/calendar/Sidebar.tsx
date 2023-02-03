import React from 'react';
// import CreateEventButton from './CreateEventButton';
import { SmallCalendar } from './SmallCalendar';
import Labels from './Labels';
export default function Sidebar() {
  return (
    <aside className="border border-color-1 p-5 w-64 rounded-l-lg">
      {/* <CreateEventButton /> */}
      <SmallCalendar />
      <Labels />
    </aside>
  );
}
