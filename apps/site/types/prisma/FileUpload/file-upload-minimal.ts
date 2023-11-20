import { Prisma } from '@prisma/client';

export const fileUploadMinimal = Prisma.validator<Prisma.FileUploadDefaultArgs>()({
  select: { id: true, url: true, name: true, size: true, type: true, createdAt: true },
});

export type FileUploadMinimal = Prisma.FileUploadGetPayload<typeof fileUploadMinimal>;
