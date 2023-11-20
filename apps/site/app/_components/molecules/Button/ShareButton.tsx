'use client';

import Button from './Button';

import { ActionType } from '@okampus/shared/enums';
import { Export } from '@phosphor-icons/react';
import { toast } from 'sonner';

export type ShareButtonProps = { size?: number; url: string; text: string; title: string };
export default function ShareButton({ url, text, title }: ShareButtonProps) {
  const onClick = () => {
    if (navigator.canShare?.({ url, text, title })) navigator.share({ url, text, title });
    else {
      navigator.clipboard.writeText(url);
      toast.info('Lien copié dans le presse-papier');
    }
  };
  return (
    <Button action={onClick} type={ActionType.Info}>
      Partager
      <Export size={28} />
    </Button>
  );
}
