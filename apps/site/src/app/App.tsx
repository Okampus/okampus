import '@okampus/ui/styles/global/colors.scss';
import '@okampus/ui/styles/global/fonts.scss';
import '@okampus/ui/styles/global/layout.scss';
import '@okampus/ui/styles/global/loader.scss';
import '@okampus/ui/styles/global/scrollbar.scss';
import '@okampus/ui/styles/global/utils.scss';
import '@okampus/ui/styles/components/button.scss';
import '@okampus/ui/styles/components/card.scss';
import '@okampus/ui/styles/components/container.scss';
import '@okampus/ui/styles/components/input.scss';
import '@okampus/ui/styles/components/status.scss';
import '@okampus/ui/styles/components/text.scss';

import './App.scss';
import './styles/layout.scss';

import { router } from './router';
import { defaultSelectedMenu } from '@okampus/shared/types';
import { NavigationContext } from '@okampus/ui/hooks';

import fr from '@okampus/assets/i18n/fr.json';

import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import type { TenantDetailsInfo } from '@okampus/shared/graphql';
import type { FileLike, SelectedMenu, ToastProps, Route } from '@okampus/shared/types';

i18n.use(initReactI18next).init({
  resources: { fr },
  lng: 'fr',
  fallbackLng: 'fr',

  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
});

const startRoute = { idx: 0, path: window.location.pathname, key: 'default' };
function App() {
  const [tenant, setTenant] = useState<TenantDetailsInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [history, setHistory] = useState<Route[]>([startRoute]);
  const [previousRoute, setPreviousRoute] = useState<Route | null>(startRoute);

  const [isTopbarAlwaysShown, setIsTopbarAlwaysShown] = useState<boolean>(false);
  const [topbar, setTopbar] = useState<React.ReactNode>(null);

  const [isSidePanelShown, setIsSidePanelShown] = useState<boolean>(false);
  const [isSidePanelUncollapsed, setIsSidePanelUncollapsed] = useState<boolean>(false);
  const [sidePanel, setSidePanel] = useState<React.ReactNode>(null);

  const [isOverlayShown, setIsOverlayShown] = useState<boolean>(false);
  const [overlay, setOverlay] = useState<React.ReactNode>(null);

  const [isFilePreviewed, setIsFilePreviewed] = useState<boolean>(false);
  const [previewedFile, setPreviewedFile] = useState<FileLike | null>(null);

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [notification, setNotification] = useState<ToastProps | null>(null);

  const [selected, setSelected] = useState<SelectedMenu>(defaultSelectedMenu);

  const showSidePanel = (modal: React.ReactNode) => (setSidePanel(modal), setIsSidePanelShown(true));
  const hideSidePanel = () => setIsSidePanelShown(false);

  const showOverlay = (modal: React.ReactNode) => (setOverlay(modal), setIsOverlayShown(true));
  const hideOverlay = () => setIsOverlayShown(false);

  const previewFile = (file: FileLike | null) => (setPreviewedFile(file), setIsFilePreviewed(true));
  const hideFilePreview = () => setIsFilePreviewed(false);

  const provideNavigationContext = {
    tenant,
    setTenant,
    isLoggedIn,
    setIsLoggedIn,

    history,
    setHistory,
    previousRoute,
    setPreviousRoute,

    isTopbarAlwaysShown,
    topbar,
    setTopbar,
    setIsTopbarAlwaysShown,

    isSidePanelShown,
    isSidePanelUncollapsed,
    sidePanel,
    showSidePanel,
    hideSidePanel,
    setIsSidePanelUncollapsed,

    isOverlayShown,
    overlay,
    showOverlay,
    hideOverlay,

    isFilePreviewed,
    previewedFile,
    previewFile,
    hideFilePreview,

    isSearching,
    setIsSearching,

    selected,
    setSelected,

    notification,
    setNotification,
  };
  return (
    <NavigationContext.Provider value={provideNavigationContext}>
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
