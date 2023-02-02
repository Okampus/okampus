/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { defaultSelectedMenu, FileLike, ModalProps, SelectedMenu } from '@okampus/shared/types';
import { ToastProps } from '@okampus/shared/types';

export const NavigationContext = React.createContext({
  modal: null as ModalProps | null,
  isModalShown: false,
  showModal: (_modal: ModalProps | null) => {},
  hideModal: () => {},

  isSideModalShown: false,
  sideModal: null as ModalProps | null,
  showSideModal: (_modal: ModalProps | null) => {},
  hideSideModal: () => {},

  previewedFile: null as FileLike | null,
  isFilePreviewed: false,
  previewFile: (_file: FileLike | null) => {},
  hideFilePreview: () => {},

  isSearching: false,
  setIsSearching: (_searching: boolean) => {},
  isLoading: false,
  setIsLoading: (_loading: boolean) => {},
  selected: defaultSelectedMenu,
  setSelected: (_selected: SelectedMenu) => {},

  notifications: [] as ToastProps[],
  setNotifications: (_notifications: ToastProps[]) => {},
  getNotifications: () => [] as ToastProps[],
});
