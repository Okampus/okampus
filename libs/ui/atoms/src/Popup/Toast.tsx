import './Toast.scss';

import { ReactComponent as CloseIcon } from '@okampus/assets/svg/icons/close.svg';

import { clsx } from 'clsx';
import { useContext } from 'react';

import { NavigationContext } from '@okampus/ui/hooks';
import { ToastType } from '@okampus/shared/types';

import type { ToastProps } from '@okampus/shared/types';

export function Toast({ id, type = ToastType.Info, message, timeout = 2000, onTimeout, onClose }: ToastProps) {
  const { removeNotification } = useContext(NavigationContext);
  setTimeout(() => {
    onTimeout?.(id);
    removeNotification(id);
  }, timeout);

  const style = {
    background:
      type === ToastType.Success
        ? 'var(--success)'
        : type === ToastType.Error
        ? 'var(--error)'
        : type === ToastType.Info
        ? 'var(--info)'
        : 'var(--bg-0)',
    color: type === ToastType.Success ? 'black' : type === ToastType.Error ? 'red' : 'var(--text-0)',
    '--progress-bar-color':
      type === ToastType.Success
        ? 'green'
        : type === ToastType.Error
        ? 'red'
        : type === ToastType.Info
        ? 'lightblue'
        : 'var(--bg-0)',
  };

  return (
    <div className="relative flex gap-4 items-center py-1.5 px-4 rounded-lg overflow-hidden" style={style}>
      <div
        className={clsx('absolute top-0 left-0 h-1 w-full progress-bar z-[1001]')}
        // @ts-expect-error --progress-bar-duration is a custom property
        style={{ '--progress-bar-duration': timeout }}
      />
      <div className="text-lg">{message}</div>
      <CloseIcon
        height={25}
        className="rounded-lg hover:cursor-pointer"
        onClick={() => {
          onClose?.(id);
          removeNotification(id);
        }}
      />
    </div>
  );
}
