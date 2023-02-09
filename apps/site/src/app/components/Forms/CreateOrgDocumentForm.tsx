import { OrgDocumentType } from '@okampus/shared/enums';
import { DynamicForm } from '@okampus/ui/organisms';
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
      inputType: 'single-file',
      label: 'Document',
      defaultValue: file,
    },
    ...(type === OrgDocumentType.TenantGuide
      ? [
          {
            fieldName: 'name',
            inputType: 'text',
            label: 'Nom du guide',
            defaultValue: '',
            placeholder: 'Nom du guide',
          },
        ]
      : []),
    {
      fieldName: 'yearVersion',
      inputType: 'number',
      label: "Année d'édition du document",
      placeholder: 'Année de versionnage du document',
    },
    {
      fieldName: 'description',
      inputType: 'text',
      label: 'Description',
      placeholder: 'Description',
    },
  ] as DynamicFieldData[];

  return (
    // <div>
    //   <HeadingSeparated title={orgDocumentTitle(type)} />
    <DynamicForm fields={fields} onSubmit={onSubmit} />
    // </div>
  );
}
