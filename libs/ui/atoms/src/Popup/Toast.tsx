import './Toast.scss';

import { ReactComponent as CloseIcon } from '@okampus/assets/svg/icons/material/filled/close.svg';
import { ReactComponent as CheckCircleIcon } from '@okampus/assets/svg/icons/material/filled/check-circle.svg';
import { ReactComponent as CloseCircleIcon } from '@okampus/assets/svg/icons/material/filled/close-circle.svg';
import { ReactComponent as InfoIcon } from '@okampus/assets/svg/icons/material/filled/info.svg';

import { ToastType } from '@okampus/shared/types';
import { NavigationContext } from '@okampus/ui/hooks';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useContext } from 'react';

import type { ToastProps } from '@okampus/shared/types';

function getButton(type: ToastType) {
  switch (type) {
    case ToastType.Success: {
      return <CheckCircleIcon className="h-6 aspect-square text-white" />;
    }
    case ToastType.Error: {
      return <CloseCircleIcon height="h-6 aspect-square text-white" />;
    }
    case ToastType.Info: {
      return <InfoIcon height="h-6 aspect-square text-white" />;
    }
    default: {
      return null;
    }
  }
}

export function Toast({
  prefix,
  type = ToastType.Info,
  button,
  useDefaultButton,
  message,
  timeout = 2000,
  onTimeout,
}: ToastProps) {
  const { setNotification } = useContext(NavigationContext);
  const close = () => (onTimeout?.(), setNotification(null));
  const timeoutId = setTimeout(close, timeout);

  const style = {
    background:
      type === ToastType.Success
        ? 'var(--success)'
        : type === ToastType.Error
        ? 'var(--danger)'
        : type === ToastType.Info
        ? 'var(--info)'
        : 'var(--bg-0)',
  };

  return (
    <motion.div
      className="relative rounded-primary text-white py-3 px-4 flex gap-4 items-center"
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
        <CloseIcon className="h-6 aspect-square cursor-pointer" onClick={() => (close(), clearTimeout(timeoutId))} />
      )}
    </motion.div>
  );
}
