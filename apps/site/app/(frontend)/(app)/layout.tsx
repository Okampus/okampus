import BottomBar from '../../_components/layouts/BottomBar';
import BottomSheet from '../../_components/layouts/BottomSheet';
import Modal from '../../_components/layouts/Modal';
import Notification from '../../_components/layouts/Notification';

import ApolloJotaiInitializeMe from '../../_components/wrappers/ApolloJotaiInitalizeMe';
import RedirectSignin from '../../_components/wrappers/RedirectSignin';

import { getApolloQuery } from '../../../server/ssr/getApolloQuery';

import { GetMeDocument } from '@okampus/shared/graphql';

import type { GetMeQuery, GetMeQueryVariables } from '@okampus/shared/graphql';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { data, errors } = await getApolloQuery<GetMeQuery, GetMeQueryVariables>({ query: GetMeDocument });

  const me = data?.getCurrentUser;
  if (errors || !me) {
    return <RedirectSignin />;
  }

  return (
    <ApolloJotaiInitializeMe me={me}>
      <Modal />
      <BottomSheet />
      <Notification />
      <main className="bg-main text-1 w-full h-full flex items-stretch overflow-hidden">{children}</main>
      <BottomBar />
    </ApolloJotaiInitializeMe>
  );
  // return (
  //   <NovuInitialize>
  //     {/* <ApolloWriteCache values={[me]}  data-superjson /> */}
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
