// TODO: improve available actions based on permissions
import { ReactComponent as FormOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/form.svg';
import { formatDateDayOfWeek } from '@okampus/shared/utils';

export type FormItemProps = {
  formId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export function FormItem({ formId, name, createdAt, updatedAt }: FormItemProps) {
  return (
    <div className="flex gap-4 card-sm bg-1 items-center">
      <FormOutlinedIcon className="h-12" />
      <div>
        <div className="text-sm font-bold">{name}</div>
        <div className="text-xs text-gray-500">
          Créé {formatDateDayOfWeek(createdAt)}•Dernière modification {formatDateDayOfWeek(updatedAt)}
        </div>
      </div>
    </div>
  );
}
