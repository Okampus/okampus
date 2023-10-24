import { ControlType } from '@okampus/shared/enums';
import type { FormSchema, SubmissionType } from '@okampus/shared/types';

export type FormSubmissionRenderProps = { submission: SubmissionType<FormSchema>; schema: FormSchema };
export default function FormSubmissionRender({ submission, schema }: FormSubmissionRenderProps) {
  return (
    <div className="flex flex-col gap-5">
      {Object.entries(submission).map(([name, value]) => {
        const field = schema.find((field) => field.name === name);
        if (!field) return null;

        // TODO: add other types
        let render;
        if (field.type === ControlType.MultiCheckbox || field.type === ControlType.Radio) {
          render = (
            <div className="flex gap-6">
              {field.options?.map((option, idx) => (
                <div key={option.value} className="flex items-center gap-2 pointer-events-none">
                  {field.type === ControlType.MultiCheckbox ? (
                    <input type="checkbox" checked={(Array.isArray(value) && value.at(idx) === true) || false} />
                  ) : (
                    <input type="radio" checked={option.value === value} />
                  )}
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          );
        } else if (field.type === ControlType.Checkbox) {
          render = value ? 'Oui' : 'Non';
        } else {
          render = JSON.stringify(value);
        }

        return (
          <li key={name} className="flex flex-col gap-1.5">
            <label className="label-title">{field.label}</label>
            <span className="text-1 text-sm">{render}</span>
          </li>
        );
      })}
    </div>
  );
}
