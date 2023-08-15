'use client';

import Toast from '../atoms/Popup/Toast';
import { notificationAtom } from '../../context/global';
import { AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';

export default function Notification() {
  const [notification] = useAtom(notificationAtom);

  return (
    <ul className="fixed bottom-4 md-max:bottom-[var(--h-bottombar)] md-max:inset-x-0 md:left-1/2 md:translate-x-[-50%] flex flex-col overflow-hidden z-[101]">
      <AnimatePresence>{notification && <Toast {...notification} />}</AnimatePresence>
    </ul>
  );
}
