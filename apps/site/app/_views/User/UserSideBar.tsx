import type { UserMinimal } from '../../../types/prisma/User/user-minimal';

export type UserSideBarProps = { user: UserMinimal };
export default async function UserSideBar({ user }: UserSideBarProps) {
  // TODO: basic yearbook
  return null;
  // return data ? (
  //   <SideBar>
  //     <SidebarTitle>Annuaire associatif</SidebarTitle>
  //     <ul className="px-2 flex flex-col gap-1">
  //       <li>
  //         <UserLabeled user={user} full={true} className="bg-2-hover rounded-lg p-2 w-full" />
  //       </li>
  //       {data.user.map((user) => (
  //         <li key={user.id}>
  //           <UserLabeled user={user} full={true} className="bg-2-hover rounded-lg p-2 w-full" />
  //         </li>
  //       ))}
  //     </ul>
  //   </SideBar>
  // ) : (
  //   <SkeletonSidebar />
  // );
}
