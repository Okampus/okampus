import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';
import { Avatar } from '@okampus/ui/atoms';
import type { MemberLabelProps } from './LabeledMember';

export function LabeledMemberHorizontal({ avatar, name, role }: MemberLabelProps) {
  return (
    <div className="flex items-start gap-4">
      <Avatar src={avatar} name={name} size={30} rounded={AVATAR_USER_ROUNDED} />
      <div className="flex flex-col py-1 gap-1">
        <div className="text-0 font-heading text-lg font-semibold">{name}</div>
        <div className="text-1 font-title -mt-0.5 line-clamp-2 leading-[1.1]">{role}</div>
      </div>
    </div>
  );
}
