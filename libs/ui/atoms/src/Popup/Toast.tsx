import './Toast.scss';

import { ReactComponent as CloseIcon } from '@okampus/assets/svg/icons/close.svg';

import { clsx } from 'clsx'; // import { useContext } from 'react';
// import { NavigationContext } from './context/NavigationContext';
import { motion } from 'framer-motion';

import type { ToastProps } from '@okampus/shared/types';

export function Toast({ id, type, message, timeout = 2000, onTimeout, onClose }: ToastProps) {
  // const { getNotifications, setNotifications } = useContext(NavigationContext);
  setTimeout(() => {
    onTimeout?.(id);
    // setNotifications(getNotifications().filter((notification) => notification.id !== id));
  }, timeout);

  const style = {
    background:
      type === 'success'
        ? 'linear-gradient(15deg, #1aab00, #04b800)'
        : type === 'error'
        ? 'linear-gradient(15deg, #ff596d, #d72c2c)'
        : 'linear-gradient(15deg, #e7e7e7, #f4f4f4)',
    color: type === 'success' ? 'white' : type === 'error' ? 'red' : 'black',
  };

  return (
    <motion.li
      className="relative flex gap-4 items-center py-1.5 px-4 rounded-lg border border-opacity-25 border-gray-200 overflow-hidden"
      style={style}
      initial={{ x: 300, opacity: 0, scale: 0.5 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 300, opacity: 0, scale: 0.2 }}
    >
      <div
        className={clsx('absolute top-0 left-0 h-1 w-full progress-bar')}
        // @ts-expect-error --progress-bar-duration is a custom property
        style={{ '--progress-bar-duration': timeout }}
      />
      <div className="text-lg">{message}</div>
      <CloseIcon
        height={25}
        className="rounded-lg hover:cursor-pointer"
        onClick={() => {
          onClose?.(id);
          // setNotifications(getNotifications().filter((notification) => notification.id !== id));
        }}
      />
    </motion.li>
  );
}
