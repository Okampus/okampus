import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GlobalRequestService } from '@lib/helpers/global-request-service';
import { BaseRepository } from '@lib/orm/base.repository';
import { ApprovalStepType } from '@lib/types/enums/approval-step-type.enum';
import { catchUniqueViolation } from '@lib/utils/catch-unique-violation';
import { getMinMax } from '@lib/utils/get-min-max';
import { EventApproval } from '@plan/approvals/approval.entity';
import { Event } from '@plan/events/event.entity';
import type { ApprovalStepDto } from '@tenants/approval-steps/dto/create-approval-step.dto';
import { UsersService } from '@uaa/users/users.service';
import { ApprovalStep } from './approval-step.entity';
import type { UpdateApprovalStepDto } from './dto/update-approval-step.dto';

@Injectable()
export class ApprovalStepsService extends GlobalRequestService {
  constructor(
    @InjectRepository(ApprovalStep) private readonly approvalStepRepository: BaseRepository<ApprovalStep>,
    @InjectRepository(EventApproval) private readonly eventApprovalRepository: BaseRepository<EventApproval>,
    @InjectRepository(Event) private readonly eventRepository: BaseRepository<Event>,
    private readonly usersService: UsersService,
  ) { super(); }

  public async create(createApprovalStepDto: ApprovalStepDto): Promise<ApprovalStep> {
    const tenant = this.currentTenant();
    const { users: wantedUsers, ...createApprovalStep } = createApprovalStepDto;

    const where = { tenant, type: createApprovalStep.type, step: createApprovalStep.step };
    const step = await this.approvalStepRepository.count(where);

    if (step > 0)
      throw new BadRequestException('Step already exists');

    const approvalStep = new ApprovalStep({ ...createApprovalStep, tenant });
    approvalStep.users.add(await this.usersService.findBareUsers(wantedUsers));

    await catchUniqueViolation(this.approvalStepRepository, approvalStep);
    return approvalStep;
  }

  public async findAll(type: ApprovalStepType): Promise<ApprovalStep[]> {
    return await this.approvalStepRepository.find(
      { tenant: this.currentTenant(), type },
      { orderBy: { step: 'ASC' }, populate: ['users'] },
    );
  }

  public async update(id: number, updateApprovalStepDto: UpdateApprovalStepDto): Promise<ApprovalStep> {
    const approvalStep = await this.approvalStepRepository.findOneOrFail({ id }, { populate: ['users'] });

    const { users, ...updateProps } = updateApprovalStepDto;
    if (users) {
      if (users.length === 0) {
        approvalStep.users.removeAll();
      } else {
        const newUsers = await this.usersService.findBareUsers(users);
        approvalStep.users.set(newUsers);
      }
    }

    wrap(approvalStep).assign(updateProps);
    await this.approvalStepRepository.flush();
    return approvalStep;
  }

  public async reinsertStep(step: number, atStepNumber: number, type: ApprovalStepType): Promise<ApprovalStep[]> {
    const tenant = this.currentTenant();
    const stepCount = await this.approvalStepRepository.count({ tenant, type });
    // TODO: Remove any approvals that have maxStep < bigStep and maxStep > smallStep
    const { min: smallStep, max: bigStep } = getMinMax(step, atStepNumber);
    if (step === atStepNumber || smallStep < 1 || bigStep > stepCount)
      throw new BadRequestException('Invalid step numbers');

    const nextSteps = await this.approvalStepRepository.find({ tenant, step: { $gte: smallStep, $lt: bigStep } });

    const currStep = await this.approvalStepRepository.findOneOrFail({ tenant, type, step });

    if (step > atStepNumber) {
      if (type === ApprovalStepType.Event) {
        const newApprovalStep = await this.approvalStepRepository.findOneOrFail({ tenant, type, step: step - 1 });
        const approvedEvents = await this.eventRepository.find({ lastApprovalStep: currStep });
        for (const approvedEvent of approvedEvents)
          approvedEvent.lastApprovalStep = newApprovalStep;

        const unapprovedApprovals = await this.eventApprovalRepository.find({
          step: { step: { $gte: smallStep, $lt: bigStep } },
        });

        for (const unapprovedApproval of unapprovedApprovals) {
          unapprovedApproval.approved = false;
          // TODO: i18n + automated reasons management
          unapprovedApproval.reason = `Refused because approval steps have been reordered by ${this.currentUser().getFullName()} (${(new Date()).toLocaleString()})`;
        }

        const nonApprovedEvents = await this.eventRepository.find(
          { lastApprovalStep: { step: { $gte: smallStep, $lt: bigStep } } },
        );
        for (const nonApprovedEvent of nonApprovedEvents)
          nonApprovedEvent.lastApprovalStep = currStep;
      }
    } else if (type === ApprovalStepType.Event) {
        const approvedEvents = await this.eventRepository.find({ lastApprovalStep: { step: atStepNumber } });
        for (const approvedEvent of approvedEvents)
          approvedEvent.lastApprovalStep = currStep;
    }

    const stepDiff = step > atStepNumber ? 1 : -1;
    for (const nextStep of nextSteps)
      nextStep.step += stepDiff;

    currStep.step = atStepNumber;

    await this.approvalStepRepository.flush();
    return await this.findAll(type);
  }

  // Public async switchSteps(step1: number, step2: number, type: ApprovalStepType): Promise<ApprovalStep[]> {
  //   const tenant = this.currentTenant();
  //   const stepCount = await this.approvalStepRepository.count({ tenant, type });
  //   // TODO: Remove any approvals that have maxStep < bigStep and maxStep > smallStep
  //   const { min: smallStep, max: bigStep } = getMinMax(step1, step2);
  //   if (step1 === step2 || smallStep < 1 || bigStep > stepCount)
  //     throw new BadRequestException('Invalid step numbers');

  //   const nextSteps = await this.approvalStepRepository.find({ tenant, step: { $gt: smallStep, $lt: bigStep } });

  //   const minStep = await this.approvalStepRepository.findOneOrFail({ tenant, type, step: smallStep });
  //   const maxStep = await this.approvalStepRepository.findOneOrFail({ tenant, type, step: bigStep });

  //   if (type === ApprovalStepType.Event) {
  //     // Set all already validated steps to the new bigger step (i.e. minStep)
  //     const maxStepEventApprovals = await this.eventApprovalRepository.find({ step: maxStep });
  //     for (const eventApproval of maxStepEventApprovals)
  //       eventApproval.step = minStep;

  //     // Set all other steps to the new smaller step (i.e. maxStep)
  //     const eventApprovals = await this.eventApprovalRepository.find(
  //       { step: { tenant, type, step: { $gt: smallStep, $lt: bigStep } } },
  //     );
  //     for (const eventApproval of eventApprovals)
  //       eventApproval.step = maxStep;

  //     await this.eventApprovalRepository.flush();
  //   }

  //   // Diminish all nextSteps by -1
  //   for (const step of nextSteps)
  //     step.step--;

  //   maxStep.step = smallStep;
  //   minStep.step = bigStep;

  //   await this.approvalStepRepository.flush();
  //   return await this.findAll(type);
  // }

  public async remove(stepId: number): Promise<void> {
    // TODO: Check if step is used in any approval, if so, remove approvals
    const step = await this.approvalStepRepository.findOneOrFail({ id: stepId });
    const nextSteps = await this.approvalStepRepository.find({ tenant: step.tenant, step: { $gt: step.step } });
    for (const nextStep of nextSteps)
      nextStep.step -= 1;

    const previousStep = step.step > 1
      ? await this.approvalStepRepository.findOneOrFail({ tenant: step.tenant, step: step.step - 1 })
      : null;

    if (step.type === ApprovalStepType.Event) {
      for (const event of await this.eventRepository.find({ lastApprovalStep: { step: step.step - 1 } }))
        event.lastApprovalStep = previousStep;

      await this.eventRepository.flush();
    }

    await this.approvalStepRepository.removeAndFlush(step);
  }

  public async addUser(stepId: number, userId: string): Promise<ApprovalStep> {
    const approvalStep = await this.approvalStepRepository.findOneOrFail({ id: stepId }, { populate: ['users'] });
    const user = await this.usersService.findBareUser(userId);
    if (!user)
      throw new BadRequestException('User not found');

    if (approvalStep.users.contains(user))
      throw new BadRequestException('User already part of step');

    approvalStep.users.add(user);

    await this.approvalStepRepository.flush();
    return approvalStep;
  }

  public async removeUser(stepId: number, userId: string): Promise<void> {
    const tenant = this.currentTenant();
    const approvalStep = await this.approvalStepRepository.findOneOrFail({ id: stepId, tenant }, { populate: ['users'] });
    const user = await this.usersService.findBareUser(userId);
    if (!user)
      throw new BadRequestException('User not found');

    if (!approvalStep.users.contains(user))
      throw new BadRequestException('User not part of step');

    approvalStep.users.remove(user);

    await this.approvalStepRepository.flush();
  }
}
