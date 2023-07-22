'use client';

import Toast from '../atoms/Popup/Toast';
import { notificationAtom } from '../../context/global';
import { AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';

export default function Notification() {
  const [notification] = useAtom(notificationAtom);

  return (
    <ul className="fixed bottom-4 left-1/2 translate-x-[-50%] flex flex-col gap-2 overflow-hidden px-10 z-[1001]">
      <AnimatePresence>{notification && <Toast {...notification} />}</AnimatePresence>
    </ul>
  );
}
