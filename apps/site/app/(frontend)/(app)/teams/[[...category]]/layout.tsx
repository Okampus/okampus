'use client';

import SideBar from '../../../../../components/layouts/SideBar';
import SkeletonLinkItem from '../../../../../components/atoms/Skeleton/SkeletonLinkItem';
import LinkItem from '../../../../../components/atoms/Item/LinkItem';
import AvatarImage from '../../../../../components/atoms/Image/AvatarImage';
import { useTypedQueryAndSubscribe } from '../../../../../hooks/apollo/useTypedQueryAndSubscribe';

import { TagType } from '@okampus/shared/enums';
import { OrderBy, tagWithUploadInfo } from '@okampus/shared/graphql';

import { IconCompass } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

export default function TeamsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const variables = { where: { type: { _eq: TagType.TeamCategory } }, orderBy: [{ name: OrderBy.ASC }] };

  const { data } = useTypedQueryAndSubscribe({ queryName: 'tag', selector: [variables, tagWithUploadInfo] });

  return (
    <>
      <SideBar>
        <LinkItem
          className="mt-[var(--py-content)]"
          pathname={pathname}
          href="/teams"
          label="Les associations"
          icon={<IconCompass />}
          large={true}
        />
        {data?.tag
          ? data.tag.map((tag) => (
              <LinkItem
                pathname={pathname}
                key={tag.id}
                href={`/teams/${tag.slug}`}
                label={tag.name}
                icon={<AvatarImage name={tag.name} src={tag.image?.url} size={null} indicativeSize={40} />}
                customIcon={true}
                large={true}
              />
            ))
          : Array.from({ length: 8 }, (_, idx) => <SkeletonLinkItem key={idx} />)}
      </SideBar>
      {children}
    </>
  );
}
