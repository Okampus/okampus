'use client';

// import { notificationsAtom } from '../../_context/global';
import { useMe } from '../../_hooks/context/useMe';

// import { HeadlessService } from '@novu/headless';
// import { useAtom } from 'jotai';

// import type { IMessage } from '@novu/shared';

// async function fetchAllNotifications(
//   fetch: HeadlessService['fetchNotifications'],
//   callback: (notifications: IMessage[]) => void
// ) {
//   const notifications: IMessage[] = [];
//   let page = 1;
//   const data: IMessage[] = [];
//   let hasMore = true;
//   let querying = true;
//   do {
//     if (querying) {
//       fetch({
//         page,
//         onSuccess: (res) => {
//           data.push(...res.data);
//           hasMore = res.hasMore;
//           querying = true;
//         },
//         listener: (res) => console.log(res),
//       });
//       notifications.push(...data);
//       callback(notifications);
//       page++;
//       querying = false;
//     }
//   } while (hasMore);
// }

export type NovuInitializeProps = { children: React.ReactNode };
export default function NovuInitialize({ children }: NovuInitializeProps) {
  const { data: me } = useMe();

  const applicationIdentifier = process.env.NEXT_PUBLIC_NOVU_APP_ID;
  const subscriberId = me.id;

  if (!applicationIdentifier || !subscriberId) return null;
  // const headlessService = new HeadlessService({ applicationIdentifier, subscriberId });

  // headlessService.initializeSession({
  //   listener: (res) => {
  //     console.log(res);
  //   },
  //   onSuccess: (session) => {
  //     console.log(session);
  //   },
  //   onError: (error) => {
  //     console.error(error);
  //   },
  // });

  // fetchAllNotifications(headlessService.fetchNotifications, setNotifications);
  //   headlessService.listenNotificationReceive =     listenUnreadCountChange({ listener, }) {
  //     this.assertSessionInitialized();
  //     if (this.socket) {
  //         this.socket.on('unread_count_changed', (data) => {
  //             if (Number.isInteger(data === null || data === void 0 ? void 0 : data.unreadCount)) {
  //                 this.queryClient.removeQueries(utils_1.NOTIFICATIONS_QUERY_KEY, {
  //                     exact: false,
  //                 });
  //                 this.queryClient.setQueryData(utils_1.UNREAD_COUNT_QUERY_KEY, (oldData) => { var _a; return ({ count: (_a = data === null || data === void 0 ? void 0 : data.unreadCount) !== null && _a !== void 0 ? _a : oldData.count }); });
  //                 listener(data.unreadCount);
  //             }
  //         });
  //     }
  //     return () => {
  //         if (this.socket) {
  //             this.socket.off('unread_count_changed');
  //         }
  //     };
  // }

  return children;
}
