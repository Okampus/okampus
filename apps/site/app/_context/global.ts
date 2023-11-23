'use client';

import { THEME_COOKIE } from '@okampus/shared/consts';

import { atom } from 'jotai/vanilla';
import Cookies from 'universal-cookie';

import type { Theme } from '../../types/theme.type';
import type { ClosableNode } from '../../types/closable.type';
import type { IMessage } from '@novu/shared';

const cookieStore = new Cookies();

export const themeAtom = atom<Theme>(cookieStore.get<Theme>(THEME_COOKIE) || 'light');

export const isBottomSheetOpenAtom = atom(false);
export const bottomSheetAtom = atom<ClosableNode>({ node: null, header: null });

export const isAnyModalOpenAtom = atom(false);
export const modalsAtom = atom<ClosableNode[]>([]);

export const notificationsAtom = atom<IMessage[]>([]);

export const atomMap = {
  theme: themeAtom,
  isBottomSheetOpen: isBottomSheetOpenAtom,
  bottomSheet: bottomSheetAtom,
  notifications: notificationsAtom,
} as const;
