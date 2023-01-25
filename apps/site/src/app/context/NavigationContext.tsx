/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { IOrg, ITenantCore } from '@okampus/shared/dtos';
import { Modal } from '../../types/ModalType';
import { ToastProps } from '@okampus/ui/atoms';

export const NavigationContext = React.createContext({
  user: null as string | null,
  setUser: (_user: string | null) => {},
  tenant: null as ITenantCore | null,
  setTenant: (_tenant: ITenantCore | null) => {},
  org: null as IOrg | null,
  setOrg: (_org: IOrg | null) => {},
  modal: null as Modal | null,
  showModal: (_modal: Modal | null) => {},
  hideModal: () => {},
  isModalShown: false,
  sideModal: null as Modal | null,
  showSideModal: (_modal: Modal | null) => {},
  hideSideModal: () => {},
  isSideModalShown: false,
  isLoading: false,
  setIsLoading: (_loading: boolean) => {},
  notifications: [] as ToastProps[],
  setNotifications: (_notifications: ToastProps[]) => {},
  getNotifications: () => [] as ToastProps[],
});
