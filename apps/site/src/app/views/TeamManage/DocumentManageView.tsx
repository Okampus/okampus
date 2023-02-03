import { CreateOrgDocumentForm } from '#site/app/components/Forms/CreateOrgDocumentForm';
import { DocumentInput, DocumentWithEdits } from '#site/app/components/Input/DocumentInput';
import { orgDocumentLabel, orgDocumentTitle } from '#site/app/misc/org-document-utils';
import { useMutation } from '@apollo/client';
import { OrgDocumentType, TeamType } from '@okampus/shared/enums';
import {
  documentFragment,
  DocumentInfoFragment,
  documentUploadFragment,
  getFragmentData,
  teamAddDocumentMutation,
  TeamManageInfoFragment,
} from '@okampus/shared/graphql';
import { NavigationContext, useCurrentContext } from '@okampus/ui/hooks';
import { useContext } from 'react';

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
  const documentUpload = getFragmentData(documentUploadFragment, document.documentUpload);
  return {
    current: {
      createdAt: document.createdAt,
      name: document.name,
      yearVersion: document.yearVersion,
      file: {
        name: documentUpload.name,
        src: documentUpload.url,
        size: documentUpload.size,
        type: documentUpload.mime,
        lastModified: new Date(documentUpload.createdAt).getTime(),
      },
    },
    edits: document.edits.map((edit) => {
      const documentUpload = getFragmentData(documentUploadFragment, edit.documentUpload);
      return {
        createdAt: edit.createdAt,
        name: documentUpload.name,
        yearVersion: edit.yearVersion,
        file: {
          name: documentUpload.name,
          src: documentUpload.url,
          size: documentUpload.size,
          type: documentUpload.mime,
          lastModified: new Date(documentUpload.createdAt).getTime(),
        },
      };
    }),
  };
}

function documentName(type: OrgDocumentType, org: TeamManageInfoFragment) {
  const label = orgDocumentLabel(type);
  if (org.actor) return `${label} de ${org.actor.name}`;
  return label;
}

export function DocumentManageView() {
  const { showModal, hideModal } = useContext(NavigationContext);
  const [{ org }, updateCache] = useCurrentContext();

  const [createOrgDocument] = useMutation(teamAddDocumentMutation, {
    onCompleted: () => {
      updateCache();
      hideModal();
    },
  });

  const currentOrgDocuments = org?.documents ?? [];
  const orgDocuments = currentOrgDocuments.map((orgDocument) => ({
    type: orgDocument.type,
    document: getDocumentWithEdits(getFragmentData(documentFragment, orgDocument.document)),
  }));

  const documents: Array<[OrgDocumentType, DocumentWithEdits | null]> = documentTypesByTeamType(org?.type).map(
    (type) => [type, orgDocuments.find((orgDocument) => orgDocument.type === type)?.document ?? null]
  );

  return (
    <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
      {documents.map(([type, document]) => (
        <div className="flex flex-col gap-4" key={type}>
          <label className="block text-xl font-medium text-2">{orgDocumentLabel(type)}</label>
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
                        if (org) {
                          createOrgDocument({
                            variables: {
                              createOrgDocument: {
                                name: document.name ?? documentName(type, org),
                                description: document.description,
                                type,
                              },
                              teamId: org.id,
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
