import './App.css';
import './styles/scrollbar.scss';
import './styles/colors.css';

import { RouterProvider } from 'react-router-dom';
import { NavigationContext } from './context/NavigationContext';
import { useEffect, useState } from 'react';
import { IOrg, ITenantCore, IUser } from '@okampus/shared/dtos';

import { router } from './router';
import { useLocalStorage } from '../hooks/useLocalStorage';
// import { SideModal } from './SideModal';

import { Modal } from '../types/ModalType';
import { ToastProps } from '@okampus/ui/atoms';

const loader = document.querySelector('.global-app-loader') as HTMLDivElement;

const showLoader = () => loader.classList.remove('hidden');
const hideLoader = () => loader.classList.add('hidden');

function App() {
  const [user, setUser] = useLocalStorage('user', null as IUser | null);
  const [tenant, setTenant] = useState<ITenantCore | null>(null);
  const [org, setOrg] = useState<IOrg | null>(null);

  const [isSideModalShown, setIsSideModalShown] = useState<boolean>(false);
  const [isModalShown, setIsModalShown] = useState<boolean>(false);
  const [sideModal, setSideModal] = useState<Modal | null>(null);
  const [modal, setModal] = useState<Modal | null>(null);
  const [notifications, setNotifications] = useState<ToastProps[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showSideModal = (modal: Modal | null) => {
    setSideModal(modal);
    setIsSideModalShown(true);
  };
  const hideSideModal = () => setIsSideModalShown(false);

  const showModal = (modal: Modal | null) => {
    setModal(modal);
    setIsModalShown(true);
  };
  const hideModal = () => setIsModalShown(false);

  useEffect(() => (isLoading ? showLoader() : hideLoader()), [isLoading]);

  if (isLoading) return null;

  const provide = {
    user,
    setUser,
    tenant,
    setTenant,
    org,
    setOrg,
    isLoading,
    setIsLoading,
    showSideModal,
    hideSideModal,
    sideModal,
    isSideModalShown,
    showModal,
    hideModal,
    modal,
    isModalShown,
    notifications,
    setNotifications,
    getNotifications: () => notifications,
  };

  return (
    <NavigationContext.Provider value={provide}>
      <RouterProvider router={router} />
    </NavigationContext.Provider>
  );
}

export default App;

if (import.meta.vitest) {
  // add tests related to your file here
  // For more information please visit the Vitest docs site here: https://vitest.dev/guide/in-source.html

  const { it, expect, beforeEach } = import.meta.vitest;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let render: any;

  beforeEach(async () => {
    const { render: r } = await import('@testing-library/react');
    render = r;
  });

  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });
}
