// TODO: improve available actions based on permissions
import { ItemCard } from './ItemCard';
import { ReactComponent as FormOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/form.svg';

import { formatDateDayOfWeek } from '@okampus/shared/utils';

import type { FormBaseInfo } from '@okampus/shared/graphql';

export type FormItemProps = { form: FormBaseInfo; onClick?: (form: FormBaseInfo) => void };

export function FormItem({ form, onClick }: FormItemProps) {
  return (
    <ItemCard onClick={() => onClick?.(form)}>
      <div className="p-5 rounded-2xl bg-1">
        <FormOutlinedIcon className="h-12 aspect-square text-2" />
      </div>
      <div className="flex flex-col gap-1 pt-2">
        <div className="text-lg font-bold">{form.name}</div>
        <div className="text-sm text-3 font-medium">Créé {formatDateDayOfWeek(form.createdAt as string)}</div>
      </div>
    </ItemCard>
  );
}
