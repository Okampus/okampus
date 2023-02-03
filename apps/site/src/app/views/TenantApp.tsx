import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Modal, Toast } from '@okampus/ui/atoms';
import { Backdrop } from '../components/Layout/Backdrop';
import Sidebar from '../components/Layout/Sidebar/Sidebar';
import { SideModal } from '../components/Layout/SideModal';
import { FilePreviewer } from '../misc/FilePreviewer';
import { NavigationContext, useCurrentContext } from '@okampus/ui/hooks';
import { selectedMenuFromPath } from '../menus';

function TenantApp() {
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
    <div className="bg-main w-full h-full overflow-hidden flex">
      <Sidebar />
      <div className="w-full px-6 pt-6 h-full overflow-x-hidden scrollbar-none">
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

export default TenantApp;

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
    const { baseElement } = render(<TenantApp />);
    expect(baseElement).toBeTruthy();
  });
}
