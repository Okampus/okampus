import { Backdrop } from '../components/Layout/Backdrop';
import { Sidebar } from '../components/Layout/Sidebar/Sidebar';
import { SideModal } from '../components/Layout/SideModal';

import { FilePreviewer } from '../misc/FilePreviewer';
import { selectedMenuFromPath } from '../menus';
import { Topbar } from '../components/Layout/Topbar';

import { NavigationContext, useMe } from '@okampus/ui/hooks';
import { Modal, Toast } from '@okampus/ui/atoms';

import { AnimatePresence, motion } from 'framer-motion';
import { useContext, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import type { Route } from '@okampus/shared/types';

export function TenantApp() {
  const { me } = useMe();
  const {
    previousRoute,
    setPreviousRoute,
    history,
    setHistory,
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

  useEffect(() => {
    const selectedMenu = selectedMenuFromPath(location.pathname);
    setSelected(selectedMenu);

    const currentIdx = window.history.state?.idx;
    const { key, pathname } = location;

    if (!history.some((route) => route.path === pathname && route.idx === currentIdx && route.key === key)) {
      const isPreviousRoute = (route: Route) =>
        route.path === previousRoute?.path && route.idx === previousRoute?.idx && route.key === previousRoute?.key;

      const previous = history.slice(0, history.findIndex(isPreviousRoute) + 1);
      setHistory([...previous, { idx: currentIdx, path: pathname, key }]);
    }

    setPreviousRoute({ idx: currentIdx, path: pathname, key });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (!me) {
    localStorage.setItem('next', location.pathname);
    return <Navigate to="/welcome" replace={true} />;
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
      </AnimatePresence>
      {isFilePreviewed && previewedFile && <FilePreviewer file={previewedFile} onClose={hideFilePreview} />}
      <ul className="absolute top-4 right-0 flex flex-col gap-2 overflow-hidden px-10 z-[101]">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.li
              key={notification.id}
              initial={{ x: 300, opacity: 0, scale: 0.5 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 300, opacity: 0.2, scale: 0.8 }}
            >
              <Toast {...notification} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
