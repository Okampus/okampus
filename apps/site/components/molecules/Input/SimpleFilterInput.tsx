import MultiCheckboxInput from './MultiCheckboxInput';
import CloseButtonIcon from '../../atoms/Icon/CloseButtonIcon';
import Popover from '../../atoms/Popup/Popover/Popover';
import PopoverContent from '../../atoms/Popup/Popover/PopoverContent';
import PopoverTrigger from '../../atoms/Popup/Popover/PopoverTrigger';
import { useOutsideClick } from '../../../hooks/useOutsideClick';

import ActionButton from '../Button/ActionButton';
import { ActionType } from '@okampus/shared/types';
import { IconFilter } from '@tabler/icons-react';
import clsx from 'clsx';

import { useState, type RefObject } from 'react';
import type { ValidRefTarget } from '../../../hooks/useOutsideClick';

export type SimpleFilterInputProps<T> = {
  className?: string;
  selected: T[];
  setSelected: (selected: T[]) => void;
  items: { label: React.ReactNode; value: T; count?: number }[];
};

const setRefIndex = (idx: number, ref: RefObject<(ValidRefTarget | null)[]>) => (el: HTMLElement | null) => {
  if (ref.current) ref.current[idx] = el;
};

export function SimpleFilterInput<T>({ className, selected, setSelected, items }: SimpleFilterInputProps<T>) {
  const [currentSelected, setCurrentSelected] = useState(selected);
  const [ref, isOpen, setIsOpen] = useOutsideClick(false);

  const total =
    currentSelected.length > 0
      ? currentSelected.reduce((acc, item) => acc + (items.find(({ value }) => value === item)?.count || 0), 0)
      : items.reduce((acc, item) => acc + (item.count || 0), 0);

  return (
    <Popover
      forcePlacement={true}
      placement="bottom-start"
      controlledOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) setCurrentSelected(selected);
      }}
    >
      <PopoverTrigger onClick={() => setIsOpen(!isOpen)} className={clsx(className, 'relative')}>
        <div
          ref={setRefIndex(0, ref)}
          className={clsx(
            'input min-h-[var(--h-input)] gap-3 justify-between',
            selected.length > 0 && 'border-2 border-[var(--border-1)]'
          )}
        >
          <div className="flex items-center gap-2">
            <IconFilter className="h-6 w-6" />
            Filtres
          </div>
          {selected.length > 0 && <div className="text-2 text-sm">{total}</div>}
        </div>
      </PopoverTrigger>
      <PopoverContent ref={setRefIndex(1, ref)} className="bg-1 p-8 rounded-md flex flex-col gap-4">
        <div className="text-2xl text-0 font-bold">Filtres</div>
        <CloseButtonIcon className="absolute top-6 right-4" onClick={() => setIsOpen(false)} />
        <span className="flex gap-5 items-center pr-32 pb-4">
          <div className="add-button" onClick={() => setCurrentSelected(items.map(({ value }) => value))}>
            Tout séléctionner
          </div>
          <div className="add-button" onClick={() => setCurrentSelected(selected)}>
            Réinitialiser
          </div>
        </span>
        <MultiCheckboxInput
          items={items.map(({ label, value }) => ({
            label: (
              <div className="w-full flex justify-between items-center text-0">
                {label}
                <div className="text-0 font-semibold text-sm">{items.find(({ value: v }) => v === value)?.count}</div>
              </div>
            ),
            value,
          }))}
          selected={items.map((item) => currentSelected.includes(item.value))}
          onChange={(selected) => setCurrentSelected(items.filter((_, idx) => selected[idx]).map(({ value }) => value))}
          options={{ name: 'filter' }}
        />
        <ActionButton
          className="mt-4"
          action={{
            label: currentSelected.length > 0 ? `Afficher ${total} résultats` : 'Afficher tous les résultats',
            linkOrActionOrMenu: () => (setSelected(currentSelected), setIsOpen(false)),
            type: ActionType.Action,
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
