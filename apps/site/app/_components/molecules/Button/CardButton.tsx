import ActionWrapper from '../../atoms/Wrapper/ActionWrapper';

import type { Action, Icons } from '@okampus/shared/types';

export type CardButtonProps = {
  active?: boolean;
  activeColor?: string;
  icons: Icons;
  label: string;
  action: Action;
};

export default function CardButton({ active, activeColor = 'var(--primary)', icons, label, action }: CardButtonProps) {
  return (
    <ActionWrapper
      action={action}
      className="w-full flex justify-center text-1 hover:bg-2 py-2.5 px-4 rounded-md active:scale-95 transition-[scale] duration-300"
      style={{ ...(active && { color: activeColor }) }}
    >
      <div className="flex items-center gap-1 text-sm">
        {active ? icons.selected || icons.base : icons.base}
        <span className="font-semibold">{label}</span>
      </div>
    </ActionWrapper>
  );
}
