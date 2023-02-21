import { Backdrop } from '../components/Layout/Backdrop';
import { Sidebar } from '../components/Layout/Sidebar/Sidebar';
import { SideModal } from '../components/Layout/SideModal';

import { FilePreviewer } from '../misc/FilePreviewer';
import { selectedMenuFromPath } from '../menus';
import { Topbar } from '../components/Layout/Topbar';

import { NavigationContext, useCurrentContext } from '@okampus/ui/hooks';
import { Modal, Toast } from '@okampus/ui/atoms';

import { AnimatePresence } from 'framer-motion';
import { useContext, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function TenantApp() {
  const {
    isModalShown,
    modal,
    hideModal,
    isSideModalShown,
    sideModal,
    hideSideModal,
    isFilePreviewed,
    previewedFile,
    hideFilePreview,
    notifications,
    setSelected,
  } = useContext(NavigationContext);

  const location = useLocation();
  const [{ user }] = useCurrentContext();

  useEffect(() => {
    const selectedMenu = selectedMenuFromPath(location.pathname);
    setSelected(selectedMenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (!user) {
    localStorage.setItem('next', location.pathname);
    return <Navigate to="/welcome" />;
  }

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="relative w-content h-full overflow-x-hidden scrollbar-none bg-main">
        <Topbar />
        <Outlet />
      </div>
      <AnimatePresence>
        {isSideModalShown && sideModal && (
          <Backdrop onClick={hideSideModal} classes="justify-end">
            <SideModal hideModal={hideModal}>{sideModal.content}</SideModal>
          </Backdrop>
        )}
        {isModalShown && modal && (
          <Backdrop onClick={hideModal} classes="items-center justify-center">
            <Modal title={modal.title}>{modal.content}</Modal>
          </Backdrop>
        )}
        {isFilePreviewed && previewedFile && <FilePreviewer file={previewedFile} onClose={hideFilePreview} />}
        {notifications.length > 0 && (
          <ul className="absolute top-4 right-0 flex flex-col gap-2 overflow-hidden px-10 z-[101]">
            {notifications.map((notification) => (
              <Toast {...notification} key={notification.id} />
            ))}
          </ul>
        )}
      </AnimatePresence>
    </div>
  );
}
