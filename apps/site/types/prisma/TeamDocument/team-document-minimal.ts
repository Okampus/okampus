import { fileUploadMinimal } from '../FileUpload/file-upload-minimal';
import { Prisma } from '@prisma/client';

export const teamDocumentMinimal = Prisma.validator<Prisma.TeamDocumentDefaultArgs>()({
  select: { id: true, name: true, description: true, fileUpload: fileUploadMinimal },
});

export type TeamDocumentMinimal = Prisma.TeamDocumentGetPayload<typeof teamDocumentMinimal>;
