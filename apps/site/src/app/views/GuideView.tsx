import { documentFragment, documentUploadFragment, getFragmentData } from '@okampus/shared/graphql';
import { NavigationContext } from '@okampus/ui/hooks';
import { DocumentCard } from '@okampus/ui/molecules';
import { useContext } from 'react';

export function GuideView() {
  const { previewFile, tenant } = useContext(NavigationContext);

  if (!tenant) return null;

  return (
    <div className="p-view grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-4">
      {tenant.documents.map((orgDocument) => {
        if (!orgDocument.document) return null;

        const document = getFragmentData(documentFragment, orgDocument.document);
        const documentUpload = getFragmentData(documentUploadFragment, document.currentVersion);

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
              yearVersion: document.yearVersion ?? null,
              url: documentUpload.url,
              type: documentUpload.mime,
              size: documentUpload.size,
            }}
          />
        );
      })}
    </div>
  );
}
