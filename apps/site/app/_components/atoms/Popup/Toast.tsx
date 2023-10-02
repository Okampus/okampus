'use client';

import './Toast.scss';
import { notificationAtom } from '../../../_context/global';

import { ToastType } from '@okampus/shared/types';

import clsx from 'clsx';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';

import { IconCircleCheckFilled, IconCircleXFilled, IconInfoCircleFilled, IconX } from '@tabler/icons-react';
import type { ToastProps } from '@okampus/shared/types';

function getButton(type: ToastType) {
  switch (type) {
    case ToastType.Success: {
      return <IconCircleCheckFilled className="h-6 aspect-square text-white" />;
    }
    case ToastType.Error: {
      return <IconCircleXFilled height="h-6 aspect-square text-white" />;
    }
    case ToastType.Info: {
      return <IconInfoCircleFilled height="h-6 aspect-square text-white" />;
    }
    default: {
      return null;
    }
  }
}

export default function Toast({
  prefix,
  type = ToastType.Info,
  button,
  useDefaultButton,
  message,
  timeout = 3000,
  onTimeout,
}: ToastProps) {
  const [, setNotification] = useAtom(notificationAtom);
  const close = () => (onTimeout?.(), setNotification(null));
  const timeoutId = setTimeout(close, timeout);

  let style;
  switch (type) {
    case ToastType.Success: {
      style = { background: 'var(--success)' };
      break;
    }
    case ToastType.Error: {
      style = { background: 'var(--danger)' };
      break;
    }
    case ToastType.Info: {
      style = { background: 'var(--info)' };
      break;
    }
    default: {
      style = { background: 'var(--bg-0)' };
      break;
    }
  }

  return (
    <motion.li
      className="relative text-white py-3 px-4 flex gap-4 items-center md:rounded-lg min-h-[var(--h-topbar)] "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: 'easeInOut', duration: 1 }}
      style={style}
    >
      <div
        className={clsx('absolute top-0 left-0 h-1 w-full progress-bar z-[1001]')}
        // @ts-expect-error --progress-bar-duration is a custom property
        style={{ '--progress-bar-duration': timeout }}
      />
      {useDefaultButton ? getButton(type) : prefix}
      <div className="grow text-lg font-medium mb-0.5">{message}</div>
      {button ?? (
        <IconX
          className="h-6 aspect-square cursor-pointer shrink-0"
          onClick={() => (close(), clearTimeout(timeoutId))}
        />
      )}
    </motion.li>
  );
}
