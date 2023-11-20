import BottomBar from '../../../_components/layouts/BottomBar';
import BottomSheet from '../../../_components/layouts/BottomSheet';
import Modal from '../../../_components/layouts/Modal';

// import ApolloJotaiInitialize from '../../../_components/wrappers/ApolloJotaiInitialize';
import RedirectSignin from '../../../_components/providers/RedirectSignin';

import { fetchMe } from '../../../_fetcher/fetchMe';

import SWRProvider from '../../../_components/providers/SWRProvider';
import type { DomainSlugParams } from '../../../params.type';
import type { UserMe } from '../../../../types/prisma/User/user-me';
// import type { DomainParams } from '../../../params.type';

export default async function AppLayout({ children, params }: { children: React.ReactNode } & DomainSlugParams) {
  // const [{ data: dataMe, errors: errorsMe }, { data: dataTenant, errors: errorsTenant }] = await Promise.all([
  //   getApolloQuery<GetMeQuery, GetMeQueryVariables>({ query: GetMeDocument }),
  //   getApolloQuery<GetTenantQuery, GetTenantQueryVariables>({ query: GetTenantDocument, variables: { domain } }),
  // ]);

  // if (process.env.NODE_ENV !== 'production')
  //   console.warn({
  //     dataMe,
  //     dataTenant,
  //     errorsMe: JSON.stringify(errorsMe),
  //     errorsTenant: JSON.stringify(errorsTenant),
  // //   });

  // const { userId, tenant } = await withAuth();

  // // const jwt = await
  // const me = await prisma.user.findFirst({ where: { id: userId }, select: userMe.select });
  // // const me = dataMe?.getCurrentUser;
  // // const tenant = dataTenant?.tenant[0];

  let me: UserMe | null = null;
  try {
    me = await fetchMe(params.domain);
  } catch {
    return <RedirectSignin />; // TODO: handle 401 and 403 differently
  }

  if (!me) return <RedirectSignin />;

  return (
    <SWRProvider fallback={{ '/api/me': me }}>
      {/* <ApolloJotaiInitialize me={me}> */}
      <Modal />
      <BottomSheet />
      <main className="bg-main text-1 w-full h-full flex items-stretch overflow-hidden">{children}</main>
      <BottomBar />
      {/* </ApolloJotaiInitialize> */}
    </SWRProvider>
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
