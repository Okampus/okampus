import { CreateOrgDocumentForm } from '#site/app/components/Forms/CreateOrgDocumentForm';
import { DocumentInput } from '#site/app/components/Input/DocumentInput';
import { orgDocumentLabel, orgDocumentTitle } from '#site/app/misc/org-document-utils';
import { OrgDocumentType, TeamType } from '@okampus/shared/enums';
import {
  documentFragment,
  documentUploadFragment,
  getFragmentData,
  teamAddDocumentMutation,
} from '@okampus/shared/graphql';
import { NavigationContext, useTeamManage } from '@okampus/ui/hooks';
import { useMutation } from '@apollo/client';
import { useContext } from 'react';
import type { DocumentInfoFragment } from '@okampus/shared/graphql';
import type { DocumentWithEdits } from '#site/app/components/Input/DocumentInput';

function documentTypesByTeamType(teamType?: TeamType) {
  switch (teamType) {
    case TeamType.Club: {
      return [OrgDocumentType.ClubCharter, OrgDocumentType.ClubHandover, OrgDocumentType.OrgGraphicCharter];
    }
    case TeamType.Association: {
      return [
        OrgDocumentType.AssociationConstitution,
        OrgDocumentType.AssociationDeclaration,
        OrgDocumentType.ClubHandover,
        OrgDocumentType.ClubCharter,
        OrgDocumentType.OrgGraphicCharter,
      ];
    }
    case TeamType.Department: {
      return [OrgDocumentType.OrgGraphicCharter];
    }
    default: {
      return [OrgDocumentType.OrgGraphicCharter];
    }
  }
}

function getDocumentWithEdits(document: DocumentInfoFragment): DocumentWithEdits {
  const documentUpload = getFragmentData(documentUploadFragment, document.current);
  return {
    current: {
      createdAt: document.createdAt,
      description: document.description,
      name: document.name,
      yearVersion: document.yearVersion ?? null,
      file: {
        name: documentUpload.name,
        src: documentUpload.url,
        size: documentUpload.size,
        type: documentUpload.mime,
        lastModified: new Date(documentUpload.createdAt).getTime(),
      },
    },
    edits: [],
    // edits: document.edits.map((edit) => {
    //   // const documentUpload = getFragmentData(documentUploadFragment, edit.newVersion);
    //   return {
    //     createdAt: edit.createdAt,
    //     description: document.description,
    //     name: documentUpload.name,
    //     // yearVersion: edit.yearVersion ?? null,
    //     file: {
    //       name: documentUpload.name,
    //       src: documentUpload.url,
    //       size: documentUpload.size,
    //       type: documentUpload.mime,
    //       lastModified: new Date(documentUpload.createdAt).getTime(),
    //     },
    //   };
    // }),
  };
}

function documentName(type: OrgDocumentType, org: { actor?: { name: string } | null }) {
  const label = orgDocumentLabel(type);
  if (org.actor) return `${label} de ${org.actor.name}`;
  return label;
}

export function DocumentManageView() {
  const { teamManage } = useTeamManage();
  const { showModal, hideModal } = useContext(NavigationContext);

  const [createOrgDocument] = useMutation(teamAddDocumentMutation, {
    onCompleted: () => {
      hideModal();
    },
  });

  const currentOrgDocuments = teamManage?.documents ?? [];
  const orgDocuments = currentOrgDocuments.map((orgDocument) => ({
    type: orgDocument.type,
    document: getDocumentWithEdits(getFragmentData(documentFragment, orgDocument.document)),
  }));

  const documents: Array<[OrgDocumentType, DocumentWithEdits | null]> = documentTypesByTeamType(teamManage?.type).map(
    (type) => [type, orgDocuments.find((orgDocument) => orgDocument.type === type)?.document ?? null]
  );

  return (
    <div className="p-view grid gap-6 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
      {documents.map(([type, document]) => (
        <div className="flex flex-col gap-4" key={type}>
          <label className="block text-xl font-semibold text-0">{orgDocumentLabel(type)}</label>
          <DocumentInput
            document={document}
            onUpload={(file) =>
              showModal({
                title: orgDocumentTitle(type),
                content: (
                  <div>
                    <CreateOrgDocumentForm
                      type={type}
                      file={file}
                      onSubmit={(document) => {
                        if (teamManage) {
                          const name = document.name ?? documentName(type, teamManage);
                          createOrgDocument({
                            variables: {
                              createOrgDocument: { description: document.description, name, type },
                              teamId: teamManage.id,
                              documentFile: document.documentFile,
                            },
                          });
                        }
                      }}
                    />
                  </div>
                ),
              })
            }
          />
        </div>
      ))}
    </div>
  );
}
