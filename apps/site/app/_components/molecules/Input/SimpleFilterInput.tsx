import Field from './Field';
import CheckboxInput from './Selector/CheckboxInput';
import CloseButtonIcon from '../../atoms/Icon/CloseButtonIcon';
import Popover from '../../atoms/Popup/Popover/Popover';
import PopoverContent from '../../atoms/Popup/Popover/PopoverContent';
import PopoverTrigger from '../../atoms/Popup/Popover/PopoverTrigger';
import { useOutsideClick } from '../../../_hooks/useOutsideClick';

import ActionButton from '../Button/ActionButton';
import { ActionType } from '@okampus/shared/types';
import { Faders } from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';

import { useState, type RefObject } from 'react';
import type { ValidRefTarget } from '../../../_hooks/useOutsideClick';

export type SimpleFilterInputProps<T> = {
  className?: string;
  selected: T[];
  setSelected: (selected: T[]) => void;
  types: { label: React.ReactNode; value: T; count?: number }[];
};

const setRefIndex = (idx: number, ref: RefObject<(ValidRefTarget | null)[]>) => (el: HTMLElement | null) => {
  if (ref.current) ref.current[idx] = el;
};

export default function SimpleFilterInput<T>({ className, selected, setSelected, types }: SimpleFilterInputProps<T>) {
  const [selectedTypes, setSelectedTypes] = useState(selected);
  const [ref, isOpen, setIsOpen] = useOutsideClick(false);

  let total = 0;
  if (selectedTypes.length > 0) {
    for (const type of selectedTypes) total += types.find(({ value }) => value === type)?.count ?? 0;
  } else {
    for (const type of types) total += type.count ?? 0;
  }

  return (
    <Popover
      forcePlacement={true}
      placement="bottom-start"
      controlledOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) setSelectedTypes(selected);
      }}
    >
      <PopoverTrigger onClick={() => setIsOpen(!isOpen)} className={clsx(className, 'relative')}>
        <div
          ref={setRefIndex(0, ref)}
          className={clsx(
            'input min-h-[var(--h-input)] gap-3 justify-between',
            selected.length > 0 && 'border-2 border-[var(--border-1)]',
          )}
        >
          <div className="flex items-center gap-2">
            <Faders className="h-6 w-6" />
            Filtres
          </div>
          {selected.length > 0 && <div className="text-2 text-sm">{total}</div>}
        </div>
      </PopoverTrigger>
      <PopoverContent ref={setRefIndex(1, ref)} className="bg-1 p-8 rounded-md flex flex-col gap-4">
        <div className="text-2xl text-0 font-bold">Filtres</div>
        <CloseButtonIcon className="absolute top-6 right-4" onClick={() => setIsOpen(false)} />
        <span className="flex gap-5 items-center pr-32 pb-4">
          <div className="add-button" onClick={() => setSelectedTypes(types.map(({ value }) => value))}>
            Tout séléctionner
          </div>
          <div className="add-button" onClick={() => setSelectedTypes(selected)}>
            Réinitialiser
          </div>
        </span>
        <Field name="filter">
          {types.map(({ label, value }, idx) => {
            return (
              <CheckboxInput
                key={idx}
                name="filter"
                label={label}
                defaultChecked={selectedTypes.includes(value)}
                onChange={() => setSelectedTypes(types.filter((_, idx) => selected[idx]).map(({ value }) => value))}
              />
            );
          })}
        </Field>
        {/* <MultiCheckboxInput
          items={types.map(({ label, value }) => ({
            label: (
              <div className="w-full flex justify-between items-center text-0">
                {label}
                <div className="text-0 font-semibold text-sm">{types.find(({ value: v }) => v === value)?.count}</div>
              </div>
            ),
            value,
          }))}
          selected={types.map((item) => selectedTypes.includes(item.value))}
          onChange={(selected) => setSelectedTypes(types.filter((_, idx) => selected[idx]).map(({ value }) => value))}
          options={{ name: 'filter' }}
        /> */}
        <ActionButton
          className="mt-4"
          action={{
            label: selectedTypes.length > 0 ? `Afficher ${total} résultats` : 'Afficher tous les résultats',
            linkOrActionOrMenu: () => (setSelected(selectedTypes), setIsOpen(false)),
            type: ActionType.Action,
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
