import { prisma } from '../db';
import { randomEnum, uniqueSlug } from '@okampus/shared/utils';

import { Colors } from '@prisma/client';
import { faker } from '@faker-js/faker';
import type { TagType } from '@prisma/client';

type FakeTagOptions = { tenant: { id: bigint; domain: string }; type: TagType };

export async function fakeTag({ tenant, type }: FakeTagOptions) {
  const name = faker.word.noun();
  return await prisma.tag.create({
    data: { name, color: randomEnum(Colors), slug: uniqueSlug(name), type, tenantScopeId: tenant.id },
  });
}
