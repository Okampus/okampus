'use client';

import { fallbackLocale } from '../../config/i18n';

import { LOCALE_COOKIE, THEME_COOKIE } from '@okampus/shared/consts';

import { atom } from 'jotai/vanilla';
import Cookies from 'universal-cookie';

import type { Theme } from '../../types/theme.type';
import type { ClosableNode } from '../../types/closable.type';
import type { Formatters, Locale } from '../../config/i18n';
import type { Determiners, IntlDict } from '../../server/ssr/getTranslation';
import type { IMessage } from '@novu/shared';

const cookieStore = new Cookies();

export const themeAtom = atom<Theme>(cookieStore.get<Theme>(THEME_COOKIE) || 'light');
export const localeAtom = atom<Locale>(cookieStore.get<Locale>(LOCALE_COOKIE) || fallbackLocale);

export const dictsIntlAtom = atom<Record<string, IntlDict | undefined>>({});
export const determinersIntlAtom = atom<Determiners>({});
export const formattersAtom = atom<Formatters>({} as Formatters);

export const isBottomSheetOpenAtom = atom(false);
export const bottomSheetAtom = atom<ClosableNode>({ node: null, header: null });

export const isAnyModalOpenAtom = atom(false);
export const modalsAtom = atom<ClosableNode[]>([]);

export const notificationsAtom = atom<IMessage[]>([]);

export const atomMap = {
  theme: themeAtom,
  locale: localeAtom,
  dictsIntl: dictsIntlAtom,
  determinersIntl: determinersIntlAtom,
  formatters: formattersAtom,
  isBottomSheetOpen: isBottomSheetOpenAtom,
  bottomSheet: bottomSheetAtom,
  notifications: notificationsAtom,
} as const;
