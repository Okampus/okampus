import { Prisma } from '@prisma/client';

export const formSubmissionMinimal = Prisma.validator<Prisma.FormSubmissionDefaultArgs>()({
  select: { id: true, submission: true },
});

export type FormSubmissionMinimal = Prisma.FormGetPayload<typeof formSubmissionMinimal>;
