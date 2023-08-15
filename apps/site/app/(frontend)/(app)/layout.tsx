import BottomSheet from '../../../components/layouts/BottomSheet';
import Modal from '../../../components/layouts/Modal';
import Notification from '../../../components/layouts/Notification';

import ApolloJotaiInitializeMe from '../../../components/wrappers/ApolloJotaiInitalizeMe';
import RedirectSignin from '../../../components/wrappers/RedirectSignin';

import { getApolloQuery } from '../../../ssr/getApolloQuery';

import BottomBar from '../../../components/layouts/BottomBar';
import { GetMeDocument } from '@okampus/shared/graphql';
import { redirect } from 'next/navigation';

import type { GetMeQuery, GetMeQueryVariables } from '@okampus/shared/graphql';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const data = await getApolloQuery<GetMeQuery, GetMeQueryVariables>({ query: GetMeDocument, onApi: true }).catch(
    (error) => {
      console.error(error);
      redirect('/signin');
    },
  );

  if (!data) return <RedirectSignin />;

  return (
    <ApolloJotaiInitializeMe me={data.me}>
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
