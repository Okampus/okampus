import { Topbar } from '../components/Layout/Topbar';
import { Sidebar } from '../components/Layout/Sidebar';

import {
  ADMIN_ROUTE,
  EVENT_ROUTE_PREFIX,
  TEAM_MANAGE_ROUTE_PREFIX,
  ME_ROUTE,
  TEAM_ROUTE_PREFIX,
  USER_ROUTE_PREFIX,
  WELCOME_ROUTE,
} from '@okampus/shared/consts';
import { SubspaceType, ViewType } from '@okampus/shared/enums';

import { Backdrop, FilePreviewer, Toast } from '@okampus/ui/atoms';
import { NavigationContext, useIsSmall } from '@okampus/ui/hooks';
import { stripSlash } from '@okampus/shared/utils';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useContext, useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useScroll } from 'react-use';

import type { Route, SelectedMenu } from '@okampus/shared/types';

const getSubspace = (path: string) => {
  const startRoute = '/' + path.split('/')[0];
  switch (startRoute) {
    case ADMIN_ROUTE: {
      return SubspaceType.Admin;
    }
    case ME_ROUTE: {
      return SubspaceType.Me;
    }
    case EVENT_ROUTE_PREFIX: {
      return SubspaceType.Event;
    }
    case TEAM_ROUTE_PREFIX: {
      return SubspaceType.Org;
    }
    case TEAM_MANAGE_ROUTE_PREFIX: {
      return SubspaceType.Manage;
    }
    case USER_ROUTE_PREFIX: {
      return SubspaceType.User;
    }
    default: {
      return SubspaceType.Home;
    }
  }
};

const TOPBAR_APPEAR_OFFSET = 150;
const getTopbarOpacity = (y: number) => {
  const scrollFull = y / TOPBAR_APPEAR_OFFSET;
  return scrollFull > 1 ? 1 : scrollFull;
};

export function TenantApp() {
  const {
    isLoggedIn,
    previousRoute,
    setPreviousRoute,
    history,
    setHistory,
    isSidePanelShown,
    isSidePanelUncollapsed,
    sidePanel,
    setIsSidePanelUncollapsed,
    isOverlayShown,
    overlay,
    hideOverlay,
    isFilePreviewed,
    previewedFile,
    hideFilePreview,
    notification,
    selected,
    setSelected,
  } = useContext(NavigationContext);

  const location = useLocation();
  const scrollRef = useRef(null);
  const isSmall = useIsSmall();
  const { y } = useScroll(scrollRef);

  useEffect(() => {
    !isSmall && setIsSidePanelUncollapsed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSmall]);

  useEffect(() => {
    const rawPath = stripSlash(location.pathname);
    const viewType = selected ? selected.viewType : ViewType.Community;

    const selectedMenu: SelectedMenu = { subSpace: getSubspace(rawPath), viewType, menuId: location.pathname };
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

  if (!isLoggedIn) {
    localStorage.setItem('next', location.pathname);
    return <Navigate to={WELCOME_ROUTE} />;
  }

  const slidingSidePanel = (
    <motion.div
      initial={{ x: '32rem', width: 0 }}
      animate={{ x: 0, width: '32rem' }}
      exit={{ x: '32rem', width: 0 }}
      transition={{ ease: 'easeInOut', duration: 0.3 }}
      className={clsx('h-full shrink-0 bg-1 overflow-x-hidden', isSmall ? 'absolute right-0' : 'relative')}
    >
      {sidePanel}
    </motion.div>
  );

  return (
    <div className="break-words flex">
      <Sidebar />
      <div className="h-screen w-content flex !overflow-x-scroll overflow-y-hidden bg-main">
        <main className="h-full w-full flex flex-col min-w-0">
          <Topbar isSmall={isSmall} opacity={getTopbarOpacity(y)} />
          <div className="h-full overflow-y-scroll scrollbar" ref={scrollRef}>
            <Outlet />
          </div>
        </main>
        <AnimatePresence>
          {sidePanel &&
            (isSmall
              ? isSidePanelUncollapsed && (
                  <Backdrop onClick={() => setIsSidePanelUncollapsed(false)}>{slidingSidePanel}</Backdrop>
                )
              : isSidePanelShown && slidingSidePanel)}
        </AnimatePresence>
      </div>

      {/* <AnimatePresence>
        {((isSmall && isSidePanelUncollapsed) || (!isSmall && isSidePanelShown)) && sidePanel && (
          <motion.div
            initial={{ x: '30rem' }}
            animate={{ x: 0 }}
            exit={{ x: '30rem', width: 0 }}
            transition={{ ease: 'easeInOut', duration: 0.4 }}
            className={clsx('w-sidepanel shrink-0 bg-1', isSmall ? 'absolute right-0' : 'relative')}
          >
            {sidePanel}
          </motion.div>
        )}
      </AnimatePresence> */}
      {/* <div className="relative w-full h-full bg-main">
        <Topbar isSmall={isSmall} opacity={getTopbarOpacity(y)} />
        <div className="h-[calc(100%-var(--topbar-height))] w-full flex absolute top-[var(--topbar-height)]">
          <div className="w-full h-full overflow-y-auto scrollbar" ref={scrollRef}>
            <div className={isSidePanelShown && sidePanel ? 'w-main-content' : 'w-full h-full'}>
              <Outlet />
            </div>
          </div>
          <AnimatePresence>
            {!isSmall && isSidePanelShown && sidePanel && (
              <motion.div
                initial={{ x: '30rem' }}
                animate={{ x: 0 }}
                exit={{ x: '30rem', width: 0 }}
                transition={{ ease: 'easeInOut', duration: 0.4 }}
                className="w-sidepanel relative shrink-0 bg-1"
              >
                {sidePanel}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div> */}
      {/* <AnimatePresence>
        {isSmall && isSidePanelUncollapsed && sidePanel && (
          <Backdrop onClick={() => setIsSidePanelUncollapsed(false)}>
            <motion.div
              initial={{ x: '30rem' }}
              animate={{ x: 0 }}
              exit={{ x: '30rem', width: 0 }}
              transition={{ ease: 'easeInOut', duration: 0.4 }}
              className="absolute w-sidepanel h-full bg-main right-0"
              onClick={(e) => e.stopPropagation()}
            >
              {sidePanel}
            </motion.div>
          </Backdrop>
        )}
      </AnimatePresence> */}
      <AnimatePresence>
        {isOverlayShown && overlay && (
          <Backdrop className="flex flex-col items-center justify-center" onClick={hideOverlay}>
            {overlay}
          </Backdrop>
        )}
      </AnimatePresence>
      {/* <AnimatePresence>
        {isModalShown && modal && (
          <Backdrop onClick={hideModal} className="flex flex-col items-center justify-center overflow-scroll">
            {modal}
          </Backdrop>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isButtonModalShown && buttonModal && (
          <Backdrop onClick={hideButtonModal} className="items-center justify-center">
            <ButtonModal title={buttonModal.title} buttons={buttonModal.buttons}>
              {buttonModal.content}
            </ButtonModal>
          </Backdrop>
        )}
      </AnimatePresence> */}
      <AnimatePresence>
        {isFilePreviewed && previewedFile && <FilePreviewer file={previewedFile} onClose={hideFilePreview} />}
      </AnimatePresence>
      <ul className="fixed bottom-4 left-1/2 translate-x-[-50%] flex flex-col gap-2 overflow-hidden px-10 z-[1001]">
        <AnimatePresence>{notification && <Toast {...notification} />}</AnimatePresence>
      </ul>
    </div>
  );
}
