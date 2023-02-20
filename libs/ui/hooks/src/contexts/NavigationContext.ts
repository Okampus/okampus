/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { defaultSelectedMenu } from '@okampus/shared/types';

import type { FileLike, ModalProps, SelectedMenu } from '@okampus/shared/types';
import type { ToastProps } from '@okampus/shared/types';

type NavigationContextProps = {
  modal: ModalProps | null;
  isModalShown: boolean;
  showModal: (modal: ModalProps | null) => void;
  hideModal: () => void;

  isSideModalShown: boolean;
  sideModal: ModalProps | null;
  showSideModal: (modal: ModalProps | null) => void;
  hideSideModal: () => void;

  previewedFile: FileLike | null;
  isFilePreviewed: boolean;
  previewFile: (file: FileLike | null) => void;
  hideFilePreview: () => void;

  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  selected: SelectedMenu;
  setSelected: (selected: SelectedMenu) => void;

  notifications: ToastProps[];
  setNotifications: (notifications: ToastProps[]) => void;
  getNotifications: () => ToastProps[];
};

export const NavigationContext = React.createContext<NavigationContextProps>({
  modal: null,
  isModalShown: false,
  showModal: () => {},
  hideModal: () => {},

  isSideModalShown: false,
  sideModal: null,
  showSideModal: () => {},
  hideSideModal: () => {},

  previewedFile: null,
  isFilePreviewed: false,
  previewFile: () => {},
  hideFilePreview: () => {},

  isSearching: false,
  setIsSearching: () => {},
  isLoading: false,
  setIsLoading: () => {},
  selected: defaultSelectedMenu,
  setSelected: () => {},

  notifications: [],
  setNotifications: () => {},
  getNotifications: () => [],
});
