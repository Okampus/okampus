import { ControlType } from '@okampus/shared/enums';
import type { FormFieldValue, FormSchema, Submission } from '@okampus/shared/types';

export type FormSubmissionRenderProps = {
  submission: Submission<FormSchema>;
  schema: FormSchema;
};

export function FormSubmissionRender({ submission, schema }: FormSubmissionRenderProps) {
  return (
    <div className="flex flex-col gap-5">
      {Object.entries(submission).map(([name, value]) => {
        const field = schema.find((field) => field.name === name);
        if (!field) return null;

        return (
          <div key={name} className="flex flex-col gap-1.5 card-md bg-0">
            <label className="font-semibold text-2 text-xl">{field.label}</label>
            <span className="text-0 text-xl">
              {field.type === ControlType.MultiCheckbox || field.type === ControlType.Radio ? (
                <div className="flex gap-6">
                  {field.options?.map((optionValue, idx) => (
                    <div key={idx} className="flex items-center gap-2 pointer-events-none">
                      {field.type === ControlType.MultiCheckbox ? (
                        <input type="checkbox" checked={(value as FormFieldValue<typeof field.type>)[idx]} />
                      ) : (
                        <input type="radio" checked={idx === (value as FormFieldValue<typeof field.type>)} />
                      )}
                      <span>{optionValue.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                (value as FormFieldValue<typeof field.type>)
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
