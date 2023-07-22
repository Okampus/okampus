import { fallbackLocale } from '../locales/i18n';
import { atom } from 'jotai/vanilla';

import type { Formatters } from '../locales/i18n';
import type { Determiners, Dicts } from '../ssr/getTranslation';
import type { ToastProps } from '@okampus/shared/types';
import type { IMessage } from '@novu/shared';

export const themeAtom = atom<'light' | 'dark'>('light');
export const langAtom = atom<string>(fallbackLocale);
export const determinersAtom = atom<Determiners>({});
export const dictsAtom = atom<Dicts>({});
export const formattersAtom = atom<Formatters>({} as Formatters);

export const meSlugAtom = atom<string | null>(null);

export const isSidebarOpenAtom = atom(false);
export const isSidePanelOpenAtom = atom(false);

export type TReactNode = React.ReactElement | null | string | number | boolean;

export const isBottomSheetOpenAtom = atom(false);
export const bottomSheetAtom = atom<TReactNode>(null); // React.ReactNode causes infinite type

export const isModalOpenAtom = atom(false);
export const modalsAtom = atom<TReactNode[]>([]); // React.ReactNode causes infinite type

export const notificationAtom = atom<ToastProps | null>(null);

export const notificationsAtom = atom<IMessage[]>([]);

export const atomMap = {
  theme: themeAtom,
  lang: langAtom,
  determiners: determinersAtom,
  dicts: dictsAtom,
  formatters: formattersAtom,
  isSidebarOpen: isSidebarOpenAtom,
  isSidePanelOpen: isSidePanelOpenAtom,
  isBottomSheetOpen: isBottomSheetOpenAtom,
  bottomSheet: bottomSheetAtom,
  notification: notificationAtom,
  notifications: notificationsAtom,
} as const;
