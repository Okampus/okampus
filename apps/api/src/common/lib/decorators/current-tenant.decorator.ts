import { RequestContext } from '@medibloc/nestjs-request-context';
import { createParamDecorator } from '@nestjs/common';
import type { GlobalRequestContext } from '@lib/helpers/global-request-context';

export const CurrentTenant = createParamDecorator(() => RequestContext.get<GlobalRequestContext>().tenant);
