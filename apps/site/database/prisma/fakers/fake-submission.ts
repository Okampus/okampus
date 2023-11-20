import prisma from '../db';

import { upload } from '../../../server/services/upload';
import { getS3Key } from '../../../utils/s3/get-s3-key';
import { ControlType, EntityNames, S3BucketNames } from '@okampus/shared/enums';
import { isFormSchema, randomInt } from '@okampus/shared/utils';

import { faker } from '@faker-js/faker';

import type { AuthContextMaybeUser } from '../../../server/utils/withAuth';
import type { FormSubmissionType } from '@okampus/shared/types';
import type { Form } from '@prisma/client';

export type FakeSubmissionOptions = { form: Form; authContext: AuthContextMaybeUser };
export async function fakeFormSubmission({ form, authContext }: FakeSubmissionOptions) {
  const data: { [key in string]: FormSubmissionType<ControlType> } = {};

  if (!isFormSchema(form.schema)) throw new Error('Invalid form schema');

  for (const field of form.schema) {
    switch (field.type) {
      case ControlType.Radio: {
        data[field.name] = field.options ? randomInt(0, field.options.length - 1) : 0;
        break;
      }
      case ControlType.Select: {
        data[field.name] = field.options ? randomInt(0, field.options.length - 1) : 0;
        break;
      }
      case ControlType.Text: {
        data[field.name] = field.defaultValue ?? '';
        break;
      }
      case ControlType.Markdown: {
        data[field.name] = field.defaultValue ?? '';
        break;
      }
      case ControlType.TextArea: {
        data[field.name] = field.defaultValue ?? '';
        break;
      }
      case ControlType.Checkbox: {
        data[field.name] = randomInt(0, 1) === 1;
        break;
      }
      case ControlType.MultiCheckbox: {
        const selectedOptions = field.options?.map((_) => false) ?? [];
        if (field.options) selectedOptions[randomInt(0, field.options.length - 1)] = true;

        data[field.name] = selectedOptions;
        break;
      }
      case ControlType.Number: {
        data[field.name] = randomInt(0, 100).toString();
        break;
      }
      case ControlType.Date: {
        data[field.name] = new Date().toISOString();
        break;
      }
      case ControlType.File: {
        // const file = new File([Buffer.from(faker.lorem.paragraphs(2))], 'text.txt', { type: 'text/plain' });
        const blob = new Blob([Buffer.from(faker.lorem.paragraphs(2))], { type: 'text/plain' });
        const key = getS3Key(
          `${form.id}-text-txt`,
          EntityNames.FormSubmission,
          authContext.tenant.id,
          authContext.userId,
        );
        await upload({ blob, bucketName: S3BucketNames.Attachments, key, authContext }, async ({ id }) => {
          data[field.name] = id.toString();
        });
        break;
      }
      case ControlType.MultiFile: {
        const files: string[] = [];
        for (let i = 0; i < randomInt(1, 3); i++) {
          // const file = new File([Buffer.from(faker.lorem.paragraphs(2))], 'text.txt', { type: 'text/plain' });
          const blob = new Blob([Buffer.from(faker.lorem.paragraphs(2))], { type: 'text/plain' });
          const key = getS3Key(
            `${form.id}-text-txt-${i}`,
            EntityNames.FormSubmission,
            authContext.tenant.id,
            authContext.userId,
          );
          await upload({ blob, bucketName: S3BucketNames.Attachments, key, authContext }, async ({ id }) => {
            files.push(id.toString());
          });
        }

        data[field.name] = files;
        break;
      }
      default: {
        data[field.name] = field.defaultValue ?? null;
        break;
      }
    }
  }

  return await prisma.formSubmission.create({
    data: { formId: form.id, submission: data, createdById: authContext.userId },
  });
}
