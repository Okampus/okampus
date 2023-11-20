import ActionWrapper from '../Wrapper/ActionWrapper';
import { CaretRight } from '@phosphor-icons/react/dist/ssr';
import type { Action } from '@okampus/shared/types';

export type ChoiceItemProps = { action: Action; children: React.ReactNode };
export default function BoxItem({ action, children }: ChoiceItemProps) {
  return (
    <ActionWrapper
      action={action}
      className="flex justify-between items-center bg-[var(--bg-1)] hover:bg-[var(--bg-2)] p-4 rounded-xl"
    >
      {children}
      <CaretRight
        weight="bold"
        className="w-8 p-1.5 text-1 aspect-square border border-[var(--border-1)] rounded-full bg-[var(--bg-main)]"
      />
    </ActionWrapper>
  );
}
