// import { CreateOrgDocumentForm } from '#site/app/components/Forms/CreateOrgDocumentForm';
// import { DocumentInput } from '#site/app/components/Input/DocumentInput';
// import { teamDocumentLabel } from '#site/app/utils/team-document-utils';
// import { DocumentType, TeamType } from '@okampus/shared/enums';
// import { NavigationContext, useTeamManage } from '@okampus/ui/hooks';
// import { useMutation } from '@apollo/client';
// import { useContext } from 'react';
// import type { DocumentWithEdits } from '#site/app/components/Input/DocumentInput';
// import { DocumentBaseInfo } from '@okampus/shared/graphql';

// function documentTypesByTeamType(teamType?: TeamType) {
//   switch (teamType) {
//     case TeamType.Club: {
//       return [DocumentType.ClubCharter, DocumentType.ClubHandover, DocumentType.TeamGraphicCharter];
//     }
//     case TeamType.Association: {
//       return [
//         DocumentType.AssociationConstitution,
//         DocumentType.AssociationDeclaration,
//         DocumentType.ClubHandover,
//         DocumentType.ClubCharter,
//         DocumentType.TeamGraphicCharter,
//       ];
//     }
//     case TeamType.Department: {
//       return [DocumentType.TeamGraphicCharter];
//     }
//     default: {
//       return [DocumentType.TeamGraphicCharter];
//     }
//   }
// }

// function getDocumentWithEdits(document: DocumentBaseInfo): DocumentWithEdits {
//   return {
//     current: {
//       createdAt: document.createdAt,
//       description: document.description,
//       name: document.name,
//       yearVersion: document.yearVersion ?? null,
//       file: {
//         name: documentUpload.name,
//         src: documentUpload.url,
//         size: documentUpload.size,
//         type: documentUpload.mime,
//         lastModified: new Date(documentUpload.createdAt).getTime(),
//       },
//     },
//     edits: [],
//     // edits: document.edits.map((edit) => {
//     //   // const documentUpload = getFragmentData(documentUploadFragment, edit.newVersion);
//     //   return {
//     //     createdAt: edit.createdAt,
//     //     description: document.description,
//     //     name: documentUpload.name,
//     //     // yearVersion: edit.yearVersion ?? null,
//     //     file: {
//     //       name: documentUpload.name,
//     //       src: documentUpload.url,
//     //       size: documentUpload.size,
//     //       type: documentUpload.mime,
//     //       lastModified: new Date(documentUpload.createdAt).getTime(),
//     //     },
//     //   };
//     // }),
//   };
// }

// function documentName(type: DocumentType, org: { actor?: { name: string } | null }) {
//   const label = teamDocumentLabel(type);
//   if (org.actor) return `${label} de ${org.actor.name}`;
//   return label;
// }

export function DocumentManageView() {
  // const { teamManage } = useTeamManage();
  // const { showButtonModal, hideButtonModal } = useContext(NavigationContext);

  // const [createOrgDocument] = useMutation(teamAddDocumentMutation, {
  //   onCompleted: () => {
  //     hideButtonModal();
  //   },
  // });

  // const currentOrgDocuments = teamManage?.documents ?? [];
  // const orgDocuments = currentOrgDocuments.map((orgDocument) => ({
  //   type: orgDocument.type,
  //   document: getDocumentWithEdits(getFragmentData(documentFragment, orgDocument.document)),
  // }));

  // const documents: Array<[DocumentType, DocumentWithEdits | null]> = documentTypesByTeamType(teamManage?.type).map(
  //   (type) => [type, orgDocuments.find((orgDocument) => orgDocument.type === type)?.document ?? null]
  // );

  return (
    <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
      {/* {documents.map(([type, document]) => (
        <div className="flex flex-col gap-4" key={type}>
          <label className="block text-xl font-semibold text-0">{orgDocumentLabel(type)}</label>
          <DocumentInput
            document={document}
            onUpload={(file) =>
              showButtonModal({
                title: orgDocumentTitle(type),
                content: (
                  <div>
                    <CreateOrgDocumentForm
                      type={type}
                      file={file}
                      onSubmit={(document) => {
                        if (teamManage) {
                          const name = document.name ?? documentName(type, teamManage);
                          // createOrgDocument({
                          //   variables: {
                          //     createOrgDocument: { description: document.description, name, type },
                          //     teamId: teamManage.id,
                          //     documentFile: document.documentFile,
                          //   },
                          // });
                        }
                      }}
                    />
                  </div>
                ),
              })
            }
          />
        </div>
      ))} */}
    </div>
  );
}
