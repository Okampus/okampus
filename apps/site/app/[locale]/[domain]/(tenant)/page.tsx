import PanelView from '../../../_components/templates/PanelView';
import Sidebar from '../../../_components/layouts/Sidebar';
import HomeSidepanel from '../../../_components/layouts/SidePanel/HomeSidepanel';

import HomeView from '../../../_views/HomeView';
import WelcomeHeader from '../../../_views/WelcomeHeader';

import type { DomainParams } from '../../../params.type';

export default function HomePage({ params }: DomainParams) {
  return (
    <>
      <Sidebar />
      {/* <HomeSideBar /> */}
      {/* <BaseView header="Fil d'actualités" contentMode='centered-6xl'>
        <HomeView domain={params.domain} />
      </BaseView> */}
      <PanelView
        headerSmall={<WelcomeHeader />}
        content={<HomeView domain={params.domain} />}
        panel={<HomeSidepanel domain={params.domain} />}
      />
    </>
  );
}
