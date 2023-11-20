import { ActionType } from '@okampus/shared/enums';

const actionTypesClasses = {
  [ActionType.Action]: (active: boolean) =>
    active ? 'text-0 border-[var(--border-1)] border-2' : 'bg-[var(--bg-opposite)] text-[var(--text-opposite)]',
  [ActionType.Primary]: () => 'bg-[var(--primary)] text-white',
  [ActionType.Success]: () => 'bg-[var(--success)] text-white',
  [ActionType.Warning]: () => 'bg-[var(--warning)] text-white',
  [ActionType.Danger]: () => 'bg-[var(--danger)] text-white',
  [ActionType.Info]: () => 'text-[var(--info)] !border-[var(--info)] border-2',
  default: () => 'text-0 border-[var(--border-1)] border-2',
};

export function getClassForActionType(variant?: ActionType, active = false) {
  const styleFunction = variant ? actionTypesClasses[variant] : actionTypesClasses.default;
  return styleFunction(active);
}
