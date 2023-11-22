'use client';

import Button from './Button';

import { share } from '../../../../utils/share';
import { ActionType } from '@okampus/shared/enums';
import { Export } from '@phosphor-icons/react';

export type ShareButtonProps = { size?: number; url: string; text: string; title: string };
export default function ShareButton({ url, title, text }: ShareButtonProps) {
  return (
    <Button action={() => share(url, title, text)} type={ActionType.Info}>
      Partager
      <Export size={28} />
    </Button>
  );
}
