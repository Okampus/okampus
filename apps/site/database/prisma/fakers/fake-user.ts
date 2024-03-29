import prisma from '../db';
import { DEFAULT_USER_PASSWORD } from '../seeders/defaults';
import { passwordHashSecret } from '../../../server/secrets';

import { toSlug, uniqueSlug } from '@okampus/shared/utils';

import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
import { ActorType } from '@prisma/client';

let passwordHash: string | undefined;
const getPasswordHash = async () => {
  if (!passwordHash) passwordHash = await hash(DEFAULT_USER_PASSWORD, { secret: passwordHashSecret });
  return passwordHash;
};

type FakeUserOptions = { tenant: { id: bigint; domain: string } };
export async function fakeUser({ tenant }: FakeUserOptions) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = toSlug(`${firstName}.${lastName}@${tenant.domain}.fr`);

  return await prisma.user.create({
    data: {
      actor: { create: { name: `${firstName} ${lastName}`, email, type: ActorType.User } },
      slug: uniqueSlug(email),
      firstName,
      lastName,
      passwordHash: await getPasswordHash(),
      tenantScope: { connect: { id: tenant.id } },
    },
  });
}
