import { AvatarGroupUser } from '@okampus/ui/molecules';
import { getAvatar } from '@okampus/ui/utils';

import type { ProjectBaseInfo } from '@okampus/shared/graphql';
import type { AvatarGroupUserItem } from '@okampus/ui/molecules';

export type ProjectSidePanelProps = { project: ProjectBaseInfo };
export function ProjectSidePanel({ project }: ProjectSidePanelProps) {
  const supervisors: AvatarGroupUserItem[] = project.projectSupervisors.map(({ teamMember: { user } }) => {
    const actor = user?.individual?.actor;
    const avatar = getAvatar(actor?.actorImages);
    return { id: user.id as string, avatar, name: actor?.name, size: 16, src: avatar };
  });

  return (
    <div>
      <div className="label">Organisateurs</div>
      <AvatarGroupUser users={supervisors} />
    </div>
  );
}
