import { ControlType } from '@okampus/shared/enums';
import type { FormFieldValue, FormSchema, Submission } from '@okampus/shared/types';

export type FormSubmissionRenderProps = { submission: Submission<FormSchema>; schema: FormSchema };
export default function FormSubmissionRender({ submission, schema }: FormSubmissionRenderProps) {
  return (
    <div className="flex flex-col gap-5">
      {Object.entries(submission).map(([name, value]) => {
        const field = schema.find((field) => field.name === name);
        if (!field) return null;

        return (
          <div key={name} className="flex flex-col gap-1.5">
            <label className="menu-title">{field.label}</label>
            <span className="text-1 text-sm">
              {field.type === ControlType.MultiCheckbox || field.type === ControlType.Radio ? (
                <div className="flex gap-6">
                  {field.options?.map((optionValue, idx) => (
                    <div key={idx} className="flex items-center gap-2 pointer-events-none">
                      {field.type === ControlType.MultiCheckbox ? (
                        <input type="checkbox" checked={(value as FormFieldValue<typeof field.type>)[idx]} />
                      ) : (
                        <input type="radio" checked={idx === value} />
                      )}
                      <span>{optionValue.label}</span>
                    </div>
                  ))}
                </div>
              ) : field.type === ControlType.Checkbox ? (
                value ? (
                  'Oui'
                ) : (
                  'Non'
                )
              ) : (
                value
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
