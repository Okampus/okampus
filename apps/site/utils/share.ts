'use client';

import { toast } from 'sonner';

export function share(url: string, title: string, text: string) {
  if (navigator.canShare?.({ url, title, text })) navigator.share({ url, title, text });
  else {
    navigator.clipboard.writeText(url);
    toast.info('Lien copié dans le presse-papier');
  }
}
