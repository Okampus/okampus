// import { tenantWithDocumentsInfo, useTypedQuery } from '@okampus/shared/graphql';
// import { Skeleton } from '@okampus/ui/atoms';
// import { NavigationContext } from '@okampus/ui/hooks';
// import { DocumentCard } from '@okampus/ui/molecules';
// import { useContext } from 'react';

export function GuideView() {
  return <div></div>;
  // const { previewFile, tenant } = useContext(NavigationContext);
  // const { data } = useTypedQuery({
  //   tenant: [{ where: { id: { _eq: tenant?.id } }, limit: 1 }, tenantWithDocumentsInfo],
  // });

  // if (!tenant) return null;

  // const documents = data?.tenant?.[0]?.team?.documents;

  // return (
  //   <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-4">
  //     {documents
  //       ? documents.map((document) => {
  //           const fileUpload = document.fileUpload;
  //           const name = document.name;
  //           if (!fileUpload || !name) return null;

  //           return (
  //             <DocumentCard
  //               key={document.id as string}
  //               onClick={() =>
  //                 previewFile({
  //                   name,
  //                   src: fileUpload.url,
  //                   type: fileUpload.mime,
  //                 })
  //               }
  //               document={{
  //                 createdAt: document.createdAt as string,
  //                 name,
  //                 yearVersion: null,
  //                 url: fileUpload.url,
  //                 type: fileUpload.mime,
  //                 size: fileUpload.size,
  //               }}
  //             />
  //           );
  //         })
  //       : Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} width={72} height={72} />)}
  //   </div>
  // );
}
