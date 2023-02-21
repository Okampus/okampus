import '@okampus/ui/styles/global/colors.scss';
import '@okampus/ui/styles/global/fonts.scss';
import '@okampus/ui/styles/global/loader.scss';
import '@okampus/ui/styles/global/scrollbar.scss';
import '@okampus/ui/styles/components/button.scss';
import '@okampus/ui/styles/components/card.scss';
import '@okampus/ui/styles/components/container.scss';
import '@okampus/ui/styles/components/input.scss';
import '@okampus/ui/styles/components/status.scss';
import '@okampus/ui/styles/components/view.scss';

import './App.scss';
import './styles/layout.scss';

import { router } from './router';
import { GridLoader } from '@okampus/ui/atoms';
import { defaultSelectedMenu } from '@okampus/shared/types';
import { NavigationContext, CurrentContext } from '@okampus/ui/hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';

import type { FileLike, ModalProps, SelectedMenu, Snowflake, ToastProps } from '@okampus/shared/types';

function App() {
  const [currentUserId, setCurrentUserId] = useState<Snowflake | null>(null);
  const [currentTenantId, setCurrentTenantId] = useState<Snowflake | null>(null);
  const [currentOrgId, setCurrentOrgId] = useState<Snowflake | null>(null);

  const [isModalShown, setIsModalShown] = useState<boolean>(false);
  const [modal, setModal] = useState<ModalProps | null>(null);

  const [isSideModalShown, setIsSideModalShown] = useState<boolean>(false);
  const [sideModal, setSideModal] = useState<ModalProps | null>(null);

  const [isFilePreviewed, setIsFilePreviewed] = useState<boolean>(false);
  const [previewedFile, setPreviewedFile] = useState<FileLike | null>(null);

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<ToastProps[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<SelectedMenu>(defaultSelectedMenu);

  const showSideModal = (modal: ModalProps | null) => {
    setSideModal(modal);
    setIsSideModalShown(true);
  };
  const hideSideModal = () => setIsSideModalShown(false);

  const showModal = (modal: ModalProps | null) => {
    setModal(modal);
    setIsModalShown(true);
  };
  const hideModal = () => setIsModalShown(false);

  const previewFile = (file: FileLike | null) => {
    setPreviewedFile(file);
    setIsFilePreviewed(true);
  };
  const hideFilePreview = () => setIsFilePreviewed(false);

  const provideNavigationContext = {
    isModalShown,
    modal,
    showModal,
    hideModal,

    isSideModalShown,
    sideModal,
    showSideModal,
    hideSideModal,

    isFilePreviewed,
    previewedFile,
    previewFile,
    hideFilePreview,

    isLoading,
    setIsLoading,
    isSearching,
    setIsSearching,

    selected,
    setSelected,

    notifications,
    setNotifications,
    getNotifications: () => notifications,
  };

  const provideCacheContext = {
    currentUserId,
    setCurrentUserId,
    currentTenantId,
    setCurrentTenantId,
    currentOrgId,
    setCurrentOrgId,
  };

  return (
    <>
      <NavigationContext.Provider value={provideNavigationContext}>
        <CurrentContext.Provider value={provideCacheContext}>
          <RouterProvider router={router} />
        </CurrentContext.Provider>
      </NavigationContext.Provider>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute top-0 w-full h-full bg-black z-[100]"
          >
            <GridLoader />
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
