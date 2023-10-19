import { prisma } from '../db';
import { createUpload } from '../services/upload';

import { ControlType, EntityNames, S3BucketNames } from '@okampus/shared/enums';
import { randomInt } from '@okampus/shared/utils';

import { faker } from '@faker-js/faker';

import type { FormFieldValue, FormSchema } from '@okampus/shared/types';
import type { Prisma } from '@prisma/client';

export type FakeSubmissionOptions = {
  form: { id: bigint; schema: Prisma.JsonValue; tenantScopeId: bigint };
  createdById: bigint;
};
export async function fakeFormSubmission({ form, createdById }: FakeSubmissionOptions) {
  const data: { [key in string]: FormFieldValue<ControlType> } = {};

  for (const field of form.schema as unknown as FormSchema) {
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
        const file = await createUpload(
          Buffer.from(faker.lorem.paragraphs(2)),
          { mimetype: 'text/plain', filename: 'text.txt' },
          S3BucketNames.Attachments,
          EntityNames.FormSubmission,
          { tenantScopeId: form.tenantScopeId, createdById },
        );
        data[field.name] = file.id.toString();
        break;
      }
      case ControlType.MultiFile: {
        const file = await createUpload(
          Buffer.from(faker.lorem.paragraphs(2)),
          { mimetype: 'text/plain', filename: 'text.txt' },
          S3BucketNames.Attachments,
          EntityNames.FormSubmission,
          { tenantScopeId: form.tenantScopeId, createdById },
        );
        const file2 = await createUpload(
          Buffer.from(faker.lorem.paragraphs(3)),
          { mimetype: 'text/plain', filename: 'text.txt' },
          S3BucketNames.Attachments,
          EntityNames.FormSubmission,
          { tenantScopeId: form.tenantScopeId, createdById },
        );
        data[field.name] = [file.id.toString(), file2.id.toString()];
        break;
      }
      default: {
        data[field.name] = field.defaultValue ?? null;
        break;
      }
    }
  }

  return await prisma.formSubmission.create({
    data: {
      formId: form.id,
      submission: data,
      createdById,
      tenantScopeId: form.tenantScopeId,
    },
  });
}
