import { ControlType } from '@okampus/shared/enums';
import { DocumentType } from '@okampus/shared/enums';
import { FormModal } from '@okampus/ui/organisms';

import { ActionType } from '@okampus/shared/types';

export type CreateTeamDocumentFormProps = {
  fileId?: string;
  type: DocumentType;
  onSubmit: (data: { documentFile: string; name?: string; yearVersion: number; description: string }) => void;
};

export function CreateTeamDocumentForm({ fileId, type, onSubmit }: CreateTeamDocumentFormProps) {
  const schema = [
    {
      name: 'documentFile',
      type: ControlType.SingleFile,
      label: 'Document',
      default: fileId,
    },
    ...(type === DocumentType.TenantGuide
      ? ([
          {
            name: 'name',
            type: ControlType.Text,
            label: 'Nom du guide',
            default: '',
            placeholder: 'Nom du guide',
          },
        ] as const)
      : []),
    {
      name: 'yearVersion',
      type: ControlType.Number,
      label: "Année d'édition du document",
      placeholder: 'Année de versionnage du document',
      isRequired: true,
    },
    {
      name: 'description',
      type: ControlType.Text,
      label: 'Description',
      placeholder: 'Description',
      isRequired: true,
    },
  ] as const;

  return <FormModal title="Créer un document" schema={schema} submitOptions={{ onSubmit, type: ActionType.Success }} />;
}
