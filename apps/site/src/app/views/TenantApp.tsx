import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { NavigationContext } from '../context/NavigationContext';
import { AnimatePresence } from 'framer-motion';
import { Modal, Toast } from '@okampus/ui/atoms';
import { Backdrop } from '../components/layout/Backdrop';
import Sidebar from '../components/layout/Sidebar/Sidebar';
import { SideModal } from '../components/layout/SideModal';

function TenantApp() {
  const { user, isModalShown, isSideModalShown, modal, hideModal, sideModal, hideSideModal, notifications } =
    useContext(NavigationContext);

  console.log('user', user);

  if (!user) return <Navigate to="/welcome" />;
  // const [selected, setSelected] = useState({ menu: 0, subMenu: 0 });
  // const [theme, setTheme] = useTheme();
  return (
    <div className="bg-1 w-full h-full overflow-hidden flex">
      <Sidebar />
      <div className="w-full px-6 pt-6 h-full overflow-x-hidden scrollbar-none">
        <Outlet />
      </div>
      <AnimatePresence>
        {isSideModalShown && (
          <Backdrop onClick={hideSideModal} classes="justify-end">
            <SideModal hideModal={hideModal}>{sideModal?.content}</SideModal>
          </Backdrop>
        )}

        {isModalShown && (
          <Backdrop onClick={hideModal} classes="items-center justify-center">
            <Modal title={modal?.title}>{modal?.content}</Modal>
          </Backdrop>
        )}

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
