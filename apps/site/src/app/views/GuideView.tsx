import { documentFragment, documentUploadFragment, getFragmentData } from '@okampus/shared/graphql';
import { NavigationContext, useCurrentContext } from '@okampus/ui/hooks';
import { DocumentCard } from '@okampus/ui/molecules';
import { useContext } from 'react';

export function GuideView() {
  const { previewFile } = useContext(NavigationContext);
  const [{ tenant }] = useCurrentContext();

  // const { data } = useQuery(getTenantDocumentsQuery, {
  //   variables: {
  //     id: tenant?.id ?? 'demo',
  //   },
  // });

  // if (data) {
  //   const tenantOrg = getFragmentData(tenantFragment, data.tenantById);
  if (!tenant) return null;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-4">
      {tenant.documents.map((orgDocument) => {
        if (!orgDocument.document) return null;

        const document = getFragmentData(documentFragment, orgDocument.document);
        const documentUpload = getFragmentData(documentUploadFragment, document.documentUpload);

        return (
          <DocumentCard
            key={document.id}
            onClick={() =>
              previewFile({
                src: documentUpload.url,
                name: documentUpload.name,
                type: documentUpload.mime,
              })
            }
            document={{
              createdAt: document.createdAt,
              name: document.name,
              yearVersion: document.yearVersion ?? 2023,
              url: documentUpload.url,
              type: documentUpload.mime,
              size: documentUpload.size,
            }}
          />
        );
      })}
    </div>
  );
  // }

  // return <div>'Chargement...'</div>;
  // const { previewFile } = useContext(NavigationContext);
  // const fields: DynamicFieldData[] = [
  //   {
  //     fieldName: 'name',
  //     inputType: 'text',
  //     label: 'Name',
  //     defaultValue: '',
  //     placeholder: 'Enter your name',
  //   },
  //   {
  //     fieldName: 'age',
  //     inputType: 'number',
  //     label: 'Age',
  //     defaultValue: 18,
  //     placeholder: 'Enter your age',
  //   },
  //   {
  //     fieldName: 'language',
  //     inputType: 'select',
  //     label: 'Language',
  //     fullWidth: true,
  //     options: [
  //       { value: 'english', element: 'English' },
  //       { value: 'french', element: 'French' },
  //     ],
  //     defaultValue: 'english',
  //     placeholder: 'Select language',
  //   },
  //   {
  //     fieldName: 'address',
  //     inputType: 'text',
  //     label: 'Address',
  //     defaultValue: '',
  //     placeholder: 'Enter your address',
  //   },
  // ];
  // return (
  //   <div className="w-fit">
  //     {/* <SelectMenu
  //       items={[
  //         { value: 'English', element: <div>English</div> },
  //         { value: 'French', element: <div>French</div> },
  //         { value: 'German', element: <div>German</div> },
  //       ]}
  //       contentClassName="bg-2 mt-0 rounded-t-none"
  //       placeholder="Select language"
  //     /> */}
  //     <DynamicForm fields={fields} onSubmit={onSubmit} />
  //     {/* <input type="file" onChange={(event) => previewFile(event.target.files?.[0] ?? null)} /> */}
  //     {/* {see && file && <FilePreviewer file={file} onClose={() => setSee(false)} />} */}
  //   </div>
  // );
}
