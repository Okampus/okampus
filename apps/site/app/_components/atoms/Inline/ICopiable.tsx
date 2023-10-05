'use client';

import { notificationAtom } from '../../../_context/global';

import { ToastType } from '@okampus/shared/types';
import { Copy } from '@phosphor-icons/react';

import { useAtom } from 'jotai';

export type ICopiableProps = { text: string; copyText?: string; notificationText?: string };
export default function ICopiable({ text, copyText, notificationText }: ICopiableProps) {
  const [, setNotification] = useAtom(notificationAtom);

  const copy = () => {
    navigator.clipboard.writeText(copyText ?? text);
    setNotification({ type: ToastType.Info, message: notificationText ?? 'Copié !' });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="add-button text-sm" onClick={copy}>
        {text}
      </div>
      <Copy className="text-1 cursor-pointer h-4 w-4" onClick={copy} />
    </div>
  );
}
