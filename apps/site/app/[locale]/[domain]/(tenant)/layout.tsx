import BottomBar from '../../../_components/layouts/BottomBar';
import BottomSheet from '../../../_components/layouts/BottomSheet';
import Modal from '../../../_components/layouts/Modal';

import RedirectSignin from '../../../_components/providers/RedirectSignin';
import SWRProvider from '../../../_components/providers/SWRProvider';

import { baseUrl, protocol } from '../../../../config';
import { ErrorCode } from '../../../../server/error';

import debug from 'debug';
import { cookies } from 'next/headers';

import type { DomainSlugParams } from '../../../params.type';
import type { UserMe } from '../../../../types/prisma/User/user-me';

const debugLog = debug('app:site:AppLayout');

export default async function AppLayout({ children, params }: { children: React.ReactNode } & DomainSlugParams) {
  let me: UserMe | null = null;

  const headers = { Cookie: cookies().toString(), Origin: `${protocol}://${params.domain}.${baseUrl}` };
  const response = await fetch(`${protocol}://${params.domain}.${baseUrl}/api/me`, { headers });

  if (!response.ok) {
    debugLog('response', response);
    if (response.status === 401) return <RedirectSignin error={ErrorCode.Unauthorized} />;
    else if (response.status === 403) return <RedirectSignin error={ErrorCode.Forbidden} />;
    else return <RedirectSignin error={ErrorCode.InternalServerError} />;
  }

  me = await response.json();

  return (
    <SWRProvider fallback={{ '/api/me': me }}>
      <Modal />
      <BottomSheet />
      <main className="bg-main text-1 w-full h-full flex items-stretch overflow-hidden">{children}</main>
      <BottomBar />
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
