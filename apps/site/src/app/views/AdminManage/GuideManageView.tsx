import { MultiFileInput } from '#site/app/components/Input/MultiFileInput';
import { tenantAddDocumentMutation } from '@okampus/shared/graphql';
import { NavigationContext, useCurrentContext } from '@okampus/ui/hooks';
import { DynamicForm } from '@okampus/ui/organisms';
import { useMutation } from '@apollo/client';
import { useContext } from 'react';

import type { DynamicFieldData } from '@okampus/ui/organisms';
import type { CreateDocumentDto } from '@okampus/shared/graphql';

export function GuideManageView() {
  const { previewFile, showModal, hideModal } = useContext(NavigationContext);
  const [{ tenant }] = useCurrentContext();

  const [tenantAddDocument] = useMutation(tenantAddDocumentMutation, {
    onCompleted: () => {
      hideModal();
    },
  });

  const fields: DynamicFieldData[] = [
    {
      fieldName: 'name',
      inputType: 'text',
      label: 'Nom du guide',
      defaultValue: '',
      placeholder: 'Nom du guide',
    },
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
      placeholder: 'Description du document',
    },
  ];

  if (!tenant) return null;

  return (
    <div className="view flex flex-col gap-4">
      <MultiFileInput
        onFileClick={(renderedFile) => previewFile(renderedFile.file)}
        onFileAdd={(files) =>
          showModal({
            title: 'Ajouter un guide',
            content: (
              <DynamicForm
                fields={fields}
                onSubmit={(values) => {
                  const createDocument = {
                    ...(values as CreateDocumentDto),
                    yearVersion: Number.parseInt((values as { yearVersion: string }).yearVersion),
                  };
                  tenantAddDocument({
                    variables: {
                      createDocument,
                      documentFile: files[0].file,
                      tenantId: tenant.id,
                    },
                  });
                }}
              />
              // <CreateEventForm
              //   onSubmit={() => {
              //     // setNewEvents([...newEvents, { ...(event as ITenantEvent), key: currentId }]);
              //     hideModal();
              //     // refetch();
              //     addNotification({
              //       id: nanoid(21),
              //       type: 'success',
              //       message:
              //         "Événement soumis ! L'équipe de gestion de la vie associative validera l'évènement sous peu.",
              //       timeout: 6000,
              //     });
              //   }}
              // />
            ),
          })
        }
      />
    </div>
  );
}
