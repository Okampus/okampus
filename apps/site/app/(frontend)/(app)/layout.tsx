import BottomSheet from '../../../components/layouts/BottomSheet';
import Modal from '../../../components/layouts/Modal';

import ApolloJotaiInitializeMe from '../../../components/wrappers/ApolloJotaiInitalizeMe';
import RedirectSignin from '../../../components/wrappers/RedirectSignin';

import { getApolloQuery } from '../../../ssr/getApolloQuery';
import { userLoginInfo } from '@okampus/shared/graphql';
import type { UserLoginInfo } from '@okampus/shared/graphql';

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
