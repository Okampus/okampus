'use client';

// import LinkList from '../../../../../../../components/molecules/List/LinkList';

// import { IconListDetails, IconUsers } from '@tabler/icons-react';
// import { usePathname } from 'next/navigation';
// import { useEffect } from 'react';

type ProjectLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default function ManageProjectLayout({ children, params }: ProjectLayoutProps) {
  // const pathname = usePathname();
  // const teamRoute = (route: string) => `/team/${params.slug}/${route}`;

  // const setSidebarInner = useNavigation((state) => state.setSidebarInner);
  // const removeSidebarInner = useNavigation((state) => state.removeSidebarInner);

  // const items = [
  //   { pathname, label: 'Présentation', href: teamRoute('profile'), icon: <IconUsers /> },
  //   { pathname, label: 'Projets', href: teamRoute('projects'), icon: <IconListDetails /> },
  // ];

  // useEffect(() => {
  //   setSidebarInner({ id: 'projectManage', sidebar: <LinkList items={items} />, priority: 1 });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [setSidebarInner]);

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(() => () => removeSidebarInner('projectManage'), []);

  return children;
}
