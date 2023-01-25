import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, createAbilitiesForIndividual } from './casl/get-abilities';
import { CHECK_POLICIES_KEY } from './check-policies.decorator';
import type { PolicyHandler } from './types/policy-handler.type';
import { requestContext } from '@fastify/request-context';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const policyHandlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];
    if (policyHandlers.length === 0) return true;

    const requester = requestContext.get('requester');
    if (!requester) return false;

    const ability = createAbilitiesForIndividual(requester);

    return policyHandlers.every((handler) => this.execPolicyHandler(handler, ability));
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility): boolean {
    if (typeof handler === 'function') return handler(ability);

    return handler.handle(ability);
  }
}
