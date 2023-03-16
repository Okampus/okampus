import { ControlType } from '@okampus/shared/enums';

export interface DynamicFormSubmissionField {
  label: string;
  fieldName: string;
  inputType: ControlType;
  value: unknown;
}

export interface DynamicFormSubmissionProps {
  fields: DynamicFormSubmissionField[];
}

function getDynamicFormSubmissionFieldValue(field: DynamicFormSubmissionField): string {
  switch (field.inputType) {
    case ControlType.SingleFile: {
      return field.value as string;
    }
    case ControlType.Select: {
      return field.value as string;
    }
    case ControlType.Text: {
      return field.value as string;
    }
    case ControlType.Number: {
      return field.value as string;
    }
    default: {
      return '';
    }
  }
}

export function DynamicFormSubmission({ fields }: DynamicFormSubmissionProps) {
  console.log('fields', fields);

  return (
    <div className="flex flex-col gap-5">
      {fields.map((field) => (
        <div key={field.fieldName} className="flex flex-col gap-1.5">
          <label className="font-medium text-2 text-lg">{field.label}</label>
          <span className="text-0 text-xl">{getDynamicFormSubmissionFieldValue(field)}</span>
        </div>
      ))}
    </div>
  );
}
