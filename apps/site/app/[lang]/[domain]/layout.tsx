import BottomBar from '../../_components/layouts/BottomBar';
import BottomSheet from '../../_components/layouts/BottomSheet';
import Modal from '../../_components/layouts/Modal';
import Notification from '../../_components/layouts/Notification';

import ApolloJotaiInitialize from '../../_components/wrappers/ApolloJotaiInitialize';
import RedirectSignin from '../../_components/wrappers/RedirectSignin';

import { getApolloQuery } from '../../../server/ssr/getApolloQuery';

import { GetMeDocument, GetTenantDocument } from '@okampus/shared/graphql';

import type { GetMeQuery, GetMeQueryVariables, GetTenantQuery, GetTenantQueryVariables } from '@okampus/shared/graphql';

export type AppLayoutProps = { children: React.ReactNode; params: { domain: string } };
export default async function AppLayout({ children, params: { domain } }: AppLayoutProps) {
  const [{ data: dataMe, errors: errorsMe }, { data: dataTenant, errors: errorsTenant }] = await Promise.all([
    getApolloQuery<GetMeQuery, GetMeQueryVariables>({ query: GetMeDocument }),
    getApolloQuery<GetTenantQuery, GetTenantQueryVariables>({ query: GetTenantDocument, variables: { domain } }),
  ]);

  if (process.env.NODE_ENV !== 'production')
    console.warn({
      dataMe,
      dataTenant,
      errorsMe: JSON.stringify(errorsMe),
      errorsTenant: JSON.stringify(errorsTenant),
    });

  const me = dataMe?.getCurrentUser;
  const tenant = dataTenant?.tenant[0];

  if (errorsMe || errorsTenant || !me || !tenant) return <RedirectSignin />;

  return (
    <ApolloJotaiInitialize me={me} tenant={tenant}>
      <Modal />
      <BottomSheet />
      <Notification />
      <main className="bg-main text-1 w-full h-full flex items-stretch overflow-hidden">{children}</main>
      <BottomBar />
    </ApolloJotaiInitialize>
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
