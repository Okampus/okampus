import { ControlType } from '@okampus/shared/enums';
import type { FormField, FormSubmissionField } from '@okampus/shared/types';

export type FormSubmissionRenderProps = {
  submissionFields: FormSubmissionField[];
  formEditFields: FormField[];
};

export function FormSubmissionRender({ submissionFields, formEditFields }: FormSubmissionRenderProps) {
  return (
    <div className="flex flex-col gap-5">
      {submissionFields.map((field) => {
        const formEditField = formEditFields.find((formEditField) => formEditField.slug === field.slug);
        if (!formEditField) return null;
        return (
          <div key={field.slug} className="flex flex-col gap-1.5 card-md bg-0">
            <label className="font-semibold text-2 text-xl">{formEditField.label}</label>
            <span className="text-0 text-xl">
              {formEditField.type === ControlType.MultiCheckbox || formEditField.type === ControlType.Radio ? (
                <div className="flex gap-6">
                  {formEditField.options?.map((value, idx) => (
                    <div key={idx} className="flex items-center gap-2 pointer-events-none">
                      {formEditField.type === ControlType.MultiCheckbox ? (
                        <input type="checkbox" checked={(field.value as boolean[])[idx]} />
                      ) : (
                        <input type="radio" checked={idx === field.value} />
                      )}
                      <span>{value.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                (field.value as string)
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
