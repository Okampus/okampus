import { RequestContext } from '@medibloc/nestjs-request-context';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { GlobalRequestContext } from '@common/lib/helpers/global-request-context';
import type { AppAbility } from '../casl/casl-ability.factory';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CHECK_POLICIES_KEY } from './check-policies.decorator';
import type { PolicyHandler } from './types/policy-handler.type';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const globalRequestContext = RequestContext.get<GlobalRequestContext>();

    const policyHandlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];
    if (policyHandlers.length === 0)
      return true;

    const { user } = globalRequestContext;
    if (!user)
      return false;

    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every(handler => this.execPolicyHandler(handler, ability));
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility): boolean {
    if (typeof handler === 'function')
      return handler(ability);

    return handler.handle(ability);
  }
}
