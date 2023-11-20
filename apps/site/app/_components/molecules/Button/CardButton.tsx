import ActionWrapper from '../../atoms/Wrapper/ActionWrapper';
import type { Action } from '@okampus/shared/types';

export type CardButtonProps = { icon?: React.ReactNode; label: string; action: Action };

export default function CardButton({ icon, label, action }: CardButtonProps) {
  return (
    <button className="w-full flex justify-center text-2">
      <ActionWrapper action={action} className="flex items-center gap-2">
        {icon}
        <span className="font-medium">{label}</span>
      </ActionWrapper>
    </button>
  );
}
