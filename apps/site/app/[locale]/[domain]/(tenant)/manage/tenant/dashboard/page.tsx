// import IMoney from '../../../../../_components/atoms/Inline/IMoney';
import BaseView from '../../../../../../_components/templates/BaseView';

import prisma from '../../../../../../../database/prisma/db';

import { teamDetails } from '../../../../../../../types/prisma/Team/team-details';

import TeamDashboard from '../../../../../../_views/Dashboard/TeamDashboard';
import type { DomainParams } from '../../../../../../params.type';

// function renderDocument(showFile: (file: FileUploadMinimal) => void, document: TeamDocumentMinimal) {
//   const file = document.fileUpload;
//   if (!file) return <TextBadge color="grey">Manquant</TextBadge>;

//   return (
//     <div onClick={() => showFile(file)} className="cursor-pointer">
//       <FileIcon className="h-12 aspect-square" type={file.type} name={file.name} />
//     </div>
//   );
// }

// TODO: Use RequiredDocument

export default async function TenantDashboardPage({ params }: DomainParams) {
  // const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const teams = await prisma.team.findMany({
    where: { tenantScope: { domain: params.domain } }, // TODO: better where
    select: teamDetails.select,
  });

  // const previewFile = (file: File | ExternalFile) =>
  //   openBottomSheet({
  //     node: <FilePreviewer file={file} onClose={closeBottomSheet} />,
  //     header: `Aperçu de ${file.name}`,
  //   });

  return (
    <BaseView header="Dashboard associatif">
      <TeamDashboard teams={teams} />
    </BaseView>
  );
}
