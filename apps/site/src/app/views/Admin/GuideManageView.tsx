// import { ControlType } from '@okampus/shared/enums';
// import { insertDocumentMutation } from '@okampus/shared/graphql';

import { NavigationContext } from '@okampus/ui/hooks';
// import { MultiFileInput } from '@okampus/ui/molecules';
// import { FormSchemaRender, MultiStepForm, getDefaultFormData } from '@okampus/ui/organisms';

// import { mergeCache } from '#site/app/utils/apollo/merge-cache';
// import { useMutation } from '@apollo/client';
import { useContext } from 'react';

export function GuideManageView() {
  const {
    // previewFile, showOverlay, hideOverlay,
    tenant,
  } = useContext(NavigationContext);
  // const [tenantAddDocument] = useMutation(insertDocumentMutation);

  // const fields = [
  //   {
  //     name: 'name',
  //     type: ControlType.Text,
  //     label: 'Nom du guide',
  //     placeholder: 'Nom du guide',
  //   },
  //   {
  //     name: 'yearVersion',
  //     type: ControlType.Number,
  //     label: "Année d'édition du document",
  //     placeholder: 'Année de versionnage du document',
  //   },
  //   {
  //     name: 'description',
  //     type: ControlType.Text,
  //     label: 'Description',
  //     placeholder: 'Description du document',
  //   },
  // ] as const;

  if (!tenant) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* <MultiFileInput
        onFileClick={(renderedFile) => previewFile(renderedFile.file)}
        onFileAdd={(files) =>
          showOverlay(
            <MultiStepForm
              defaultValues={getDefaultFormData(fields)}
              title="Ajouter un guide"
              onClose={hideOverlay}
              onSubmit={(data) => {
                // const createDocument = {
                //   ...data,
                //   yearVersion: data.yearVersion,
                // };
                tenantAddDocument({
                  variables: {
                    insert: {
                      ...data,
                    },
                    // createDocument,
                    // documentFile: files[0].file,
                    // tenantId: tenant.id,
                  },
                  onCompleted: ({ insertDocumentOne: data }) => {
                    const id = tenant.team?.id as string;
                    mergeCache({ __typename: 'Team', id }, { fieldName: 'documents', fragmentOn: 'Action', data });
                  },
                });
              }}
              steps={[
                {
                  label: 'Informations',
                  // render: ({ values, setValues }) => (
                  //   <FormSchemaRender schema={fields} data={values} onChange={setValues} />
                  // ),
                },
              ]}
            />
          )
        }
        // onFileAdd={(files) =>
        //   showButtonModal({
        //     title: 'Ajouter un guide',
        //     content: (
        //       // <CreateEventForm
        //       //   onSubmit={() => {
        //       //     // setNewEvents([...newEvents, { ...(event as IEvent), key: currentId }]);
        //       //     hideButtonModal();
        //       //     // refetch();
        //       //     addNotification({
        //       //       id: nanoid(21),
        //       //       type: 'success',
        //       //       message:
        //       //         "Événement soumis ! L'équipe de gestion de la vie associative validera l'évènement sous peu.",
        //       //       timeout: 6000,
        //       //     });
        //       //   }}
        //       // />
        //     ),
        //   })
        // }
      /> */}
    </div>
  );
}
