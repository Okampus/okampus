import { OrgDocumentType } from '@okampus/shared/enums';
import { DynamicForm, ControlType } from '@okampus/ui/organisms';
import type { DynamicFieldData } from '@okampus/ui/organisms';

export type CreateOrgDocumentFormProps = {
  file?: File;
  type: OrgDocumentType;
  onSubmit: (document: { documentFile: File; name?: string; yearVersion: number; description: string }) => void;
};

export function CreateOrgDocumentForm({ file, type, onSubmit }: CreateOrgDocumentFormProps) {
  const fields: DynamicFieldData[] = [
    {
      fieldName: 'documentFile',
      inputType: ControlType.SingleFile,
      label: 'Document',
      defaultValue: file,
    },
    ...(type === OrgDocumentType.TenantGuide
      ? [
          {
            fieldName: 'name',
            inputType: ControlType.Text,
            label: 'Nom du guide',
            defaultValue: '',
            placeholder: 'Nom du guide',
          },
        ]
      : []),
    {
      fieldName: 'yearVersion',
      inputType: ControlType.Number,
      label: "Année d'édition du document",
      placeholder: 'Année de versionnage du document',
    },
    {
      fieldName: 'description',
      inputType: ControlType.Text,
      label: 'Description',
      placeholder: 'Description',
    },
  ];

  return (
    // <div>
    //   <HeadingSeparated title={orgDocumentTitle(type)} />
    <DynamicForm fields={fields} onSubmit={onSubmit} />
    // </div>
  );
}
