import BottomSheet from '../../../components/layouts/BottomSheet';
import Modal from '../../../components/layouts/Modal';

import ApolloJotaiInitializeMe from '../../../components/wrappers/ApolloJotaiInitalizeMe';
import RedirectSignin from '../../../components/wrappers/RedirectSignin';

import { getApolloQuery } from '../../../ssr/getApolloQuery';
import { userLoginInfo } from '@okampus/shared/graphql';

import type { Metadata } from 'next';
import type { UserLoginInfo } from '@okampus/shared/graphql';

const APP_NAME = 'Okampus';
const APP_DESCRIPTION =
  'Student platform & digital workspace for schools - A SaaS solution to improve in-school communication';

export const metadata: Metadata = {
  title: 'Bienvenue sur Okampus 🚀',
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: 'default',
  },
  keywords: ['education', 'schools', 'students', 'university', 'student clubs', 'productivity'],
  formatDetection: { telephone: false },
  themeColor: '#f15',
  viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
  manifest: '/manifest.json',
  icons: [
    { rel: 'apple-touch-icon', url: '/icons/apple-touch-icon.png' },
    { rel: 'shortcut icon', url: '/favicon.ico' },
  ],
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const me = await getApolloQuery<UserLoginInfo>('me', userLoginInfo, true).catch(() => null);

  if (!me) return <RedirectSignin />;

  return (
    <ApolloJotaiInitializeMe me={me}>
      <Modal />
      <BottomSheet />
      <main className="bg-main w-full h-full flex items-stretch">{children}</main>
    </ApolloJotaiInitializeMe>
  );
  // return (
  //   <NovuInitialize>
  //     {/* <ApolloWriteCache values={[me]} /> */}
  //     {/* <div className="flex w-full h-[var(--h-content)] overflow-hidden bg-[var(--bg-main)]"> */}
  //     {/* <SideBar /> */}
  //     <main className="w-full h-full min-w-0 xl:pr-4">
  //       <TopBar />
  //       {children}
  //     </main>
  //     {/* <SidePanel /> */}
  //     {/* </div> */}
  //   </NovuInitialize>
  // );
}
