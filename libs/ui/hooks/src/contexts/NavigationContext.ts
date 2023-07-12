/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { defaultSelectedMenu } from '@okampus/shared/types';

import type { TenantDetailsInfo } from '@okampus/shared/graphql';
import type { FileLike, SelectedMenu, Route } from '@okampus/shared/types';
import type { ToastProps } from '@okampus/shared/types';

export type NavigationContextProps = {
  tenant: TenantDetailsInfo | null;
  setTenant: (tenant: TenantDetailsInfo | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;

  history: Route[];
  setHistory: (route: Route[]) => void;
  previousRoute: Route | null;
  setPreviousRoute: (route: Route | null) => void;

  topbar: React.ReactNode;
  setTopbar: (topbar: React.ReactNode) => void;
  isTopbarAlwaysShown: boolean;
  setIsTopbarAlwaysShown: (isTopbarAlwaysShown: boolean) => void;

  sidePanel: React.ReactNode;
  isSidePanelShown: boolean;
  isSidePanelUncollapsed: boolean;
  showSidePanel: (modal: React.ReactNode) => void;
  hideSidePanel: () => void;
  setIsSidePanelUncollapsed: (isUncollapsed: boolean) => void;

  isOverlayShown: boolean;
  overlay: React.ReactNode;
  showOverlay: (modal: React.ReactNode) => void;
  hideOverlay: () => void;

  previewedFile: FileLike | null;
  isFilePreviewed: boolean;
  previewFile: (file: FileLike | null) => void;
  hideFilePreview: () => void;

  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
  selected: SelectedMenu;
  setSelected: (selected: SelectedMenu) => void;

  notification: ToastProps | null;
  setNotification: (notification: ToastProps | null) => void;
};

export const NavigationContext = React.createContext<NavigationContextProps>({
  tenant: null,
  setTenant: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},

  history: [],
  setHistory: () => {},
  previousRoute: null,
  setPreviousRoute: () => {},

  topbar: null,
  setTopbar: () => {},
  isTopbarAlwaysShown: false,
  setIsTopbarAlwaysShown: () => {},

  isSidePanelShown: false,
  isSidePanelUncollapsed: false,
  sidePanel: null,
  showSidePanel: () => {},
  hideSidePanel: () => {},
  setIsSidePanelUncollapsed: () => {},

  isOverlayShown: false,
  overlay: null,
  showOverlay: () => {},
  hideOverlay: () => {},

  isFilePreviewed: false,
  previewedFile: null,
  previewFile: () => {},
  hideFilePreview: () => {},

  isSearching: false,
  setIsSearching: () => {},
  selected: defaultSelectedMenu,
  setSelected: () => {},

  notification: null,
  setNotification: () => {},
});
