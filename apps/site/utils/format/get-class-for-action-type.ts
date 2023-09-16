import { ActionType } from '@okampus/shared/types';

const actionTypesClasses = {
  [ActionType.Action]: (active: boolean) =>
    active ? 'text-0 border-[var(--border-1)] border dark:!border-gray-400' : 'bg-opposite text-opposite',
  [ActionType.Primary]: () => 'bg-[var(--primary)] text-white',
  [ActionType.Success]: () => 'bg-[var(--success)] text-white',
  [ActionType.Warning]: () => 'bg-[var(--warning)] text-white',
  [ActionType.Danger]: () => 'bg-[var(--danger)] text-white',
  [ActionType.Info]: () => 'text-0 bg-3',
  default: () => 'text-0 border',
};

export function getClassForActionType(variant?: ActionType, active = false) {
  const styleFunction = variant ? actionTypesClasses[variant] : actionTypesClasses.default;
  return styleFunction(active);
}
