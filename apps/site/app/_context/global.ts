'use client';

import { fallbackLocale } from '../../config/i18n';

import { LOCALE_COOKIE, THEME_COOKIE } from '@okampus/shared/consts';

import { atom } from 'jotai/vanilla';
import Cookies from 'universal-cookie';

import type { Theme } from '../../types/theme.type';
import type { ClosableNode } from '../../types/closable.type';
import type { Formatters, Locale } from '../../config/i18n';
import type { Determiners, IntlDict } from '../../server/ssr/getTranslation';
import type { ToastProps } from '@okampus/shared/types';
import type { IMessage } from '@novu/shared';

const cookieStore = new Cookies();

export const themeAtom = atom<Theme>(cookieStore.get<Theme>(THEME_COOKIE) || 'light');
export const langAtom = atom<Locale>(cookieStore.get<Locale>(LOCALE_COOKIE) || fallbackLocale);

export const dictsIntlAtom = atom<Record<string, IntlDict | undefined>>({});
export const determinersIntlAtom = atom<Determiners>({});
export const formattersAtom = atom<Formatters>({} as Formatters);

export const meSlugAtom = atom<string | null>(null);

export const isSidebarOpenAtom = atom(false);
export const isSidePanelOpenAtom = atom(false);

export const isBottomSheetOpenAtom = atom(false);
export const bottomSheetAtom = atom<ClosableNode>({ node: null });

export const isModalOpenAtom = atom(false);
export const modalsAtom = atom<ClosableNode[]>([]);

export const notificationAtom = atom<ToastProps | null>(null);
export const notificationsAtom = atom<IMessage[]>([]);

export const atomMap = {
  theme: themeAtom,
  lang: langAtom,
  dictsIntl: dictsIntlAtom,
  determinersIntl: determinersIntlAtom,
  formatters: formattersAtom,
  isSidebarOpen: isSidebarOpenAtom,
  isSidePanelOpen: isSidePanelOpenAtom,
  isBottomSheetOpen: isBottomSheetOpenAtom,
  bottomSheet: bottomSheetAtom,
  notification: notificationAtom,
  notifications: notificationsAtom,
} as const;
