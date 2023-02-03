import React, { useContext } from 'react';
// import plusImg from "../assets/plus.svg";
import GlobalContext from './GlobalContext';

export default function CreateEventButton() {
  const { setShowEventModal } = useContext(GlobalContext);
  return (
    <button
      onClick={() => setShowEventModal(true)}
      className="border border-color-1 p-2 rounded-full flex items-center"
    >
      {/* <img src={plusImg} alt="create_event" className="w-7 h-7" /> */}
      {/* <span className="px-3 text-1">Create</span> */}
    </button>
  );
}
