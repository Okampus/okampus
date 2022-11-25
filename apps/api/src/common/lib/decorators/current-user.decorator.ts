import { RequestContext } from '@medibloc/nestjs-request-context';
import { createParamDecorator } from '@nestjs/common';
import type { GlobalRequestContext } from '@common/lib/helpers/global-request-context';

export const CurrentUser = createParamDecorator(() => RequestContext.get<GlobalRequestContext>().user);
