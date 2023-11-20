'use client';

import { Copy } from '@phosphor-icons/react';
import { toast } from 'sonner';

export type ICopiableProps = { text: string; copyText?: string; notificationText?: string };
export default function ICopiable({ text, copyText, notificationText }: ICopiableProps) {
  const copy = () => {
    navigator.clipboard.writeText(copyText ?? text);
    toast(notificationText ?? 'Copié !'); // TODO: replace by toast info
  };

  return (
    <div className="flex items-center gap-2">
      <div className="button-underline text-sm" onClick={copy}>
        {text}
      </div>
      <Copy className="text-1 cursor-pointer h-4 w-4" onClick={copy} />
    </div>
  );
}
