import Section from '../../atoms/Container/Section';
import AvatarImage from '../../atoms/Image/AvatarImage';
import AvatarLabeled from '../../molecules/Labeled/AvatarLabeled';
import RedirectSignin from '../../providers/RedirectSignin';

import prisma from '../../../../database/prisma/db';

import { withAuth } from '../../../../server/utils/withAuth';

import { actorWithAvatar } from '../../../../types/prisma/Actor/actor-with-avatar';
import { teamMinimal } from '../../../../types/prisma/Team/team-minimal';

import { SignOut } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

export type HomeSidepanelProps = { domain: string };
export default async function HomeSidepanel({ domain }: HomeSidepanelProps) {
  const { userId } = await withAuth();
  const meWhere = { id: userId, tenantScope: { domain } };

  const me = await prisma.user.findFirst({ where: meWhere, select: { slug: true, actor: actorWithAvatar } });
  if (!me) return <RedirectSignin />;

  const teams = await prisma.team.findMany({ where: { tenantScope: { domain } }, select: teamMinimal.select });
  return (
    <div>
      <div className="flex items-center justify-between">
        <AvatarLabeled actor={me.actor} content={me.slug} />
        {/* <div className="relative flex items-center gap-3">
          <AvatarImage actor={me.actor} size={48} />
          <div>
            <Link href="/me" className="text-0 font-medium card-link">
              {me.actor.name}
            </Link>
            <div className="text-2 text-sm leading-4">{me.slug}</div>
          </div>
        </div> */}
        <Link href="/api/auth/signout">
          <SignOut className="button-icon" />
        </Link>
      </div>
      <Section title="Suggestions d'associations">
        <div className="flex flex-col gap-3">
          {teams.map((team) => (
            <div key={team.id} className="relative flex items-center gap-3">
              <AvatarImage actor={team.actor} size={48} />
              <div>
                <Link href={`/team/${team.slug}`} className="text-0 font-medium card-link">
                  {team.actor.name}
                </Link>
                <div className="text-2 text-sm leading-4">{team._count.teamMembers} membres</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
