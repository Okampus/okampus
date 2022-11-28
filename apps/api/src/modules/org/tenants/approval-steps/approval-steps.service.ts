import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/lib/orm/base.repository';
import type { ApprovalStepType } from '@common/lib/types/enums/approval-step-type.enum';
import type { ApprovalStepDto } from '@modules/org/tenants/approval-steps/dto/create-approval-step.dto';
import { User } from '@modules/uaa/users/user.entity';
import { Tenant } from '../tenant.entity';
import { ApprovalStep } from './approval-step.entity';
import type { UpdateApprovalStepDto } from './dto/update-approval-step.dto';

@Injectable()
export class ApprovalStepsService {
  constructor(
    @InjectRepository(Tenant) private readonly tenantRepository: BaseRepository<Tenant>,
    @InjectRepository(ApprovalStep) private readonly approvalStepRepository: BaseRepository<ApprovalStep>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
  ) {}

  public async create(tenant: Tenant, createApprovalStepDto: ApprovalStepDto): Promise<ApprovalStep> {
    const step = await this.approvalStepRepository.count({ tenant, step: createApprovalStepDto.step });
    if (step > 0)
      throw new BadRequestException('Step already exists');

    const { users: wantedUsers, ...dto } = createApprovalStepDto;
    const approvalStep = new ApprovalStep({ ...dto, tenant });

    const users = await this.userRepository.find({ id: { $in: wantedUsers } });
    approvalStep.users.add(...users);

    await this.approvalStepRepository.persistAndFlush(approvalStep);
    return approvalStep;
  }

  public async findAll(tenant: Tenant, type: ApprovalStepType): Promise<ApprovalStep[]> {
    return await this.approvalStepRepository.find(
      { tenant, type },
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
        const newUsers = await this.userRepository.find({ id: { $in: users } });
        approvalStep.users.set(newUsers);
      }
    }

    wrap(approvalStep).assign(updateProps);
    await this.approvalStepRepository.flush();
    return approvalStep;
  }

  public async insertStep(tenant: Tenant, step: number, atStep: number): Promise<Tenant> {
    const stepCount = await this.approvalStepRepository.count({ tenant });
    if (step === atStep || step < 1 || step > stepCount || step < 1 || atStep > stepCount)
      throw new BadRequestException('Invalid step numbers');

    const approvalStep = await this.approvalStepRepository.findOneOrFail({ tenant, step });
    if (step < atStep) {
      const previousSteps = await this.approvalStepRepository.find(
        { tenant, step: { $gt: step, $lte: atStep } },
      );

      for (const previousStep of previousSteps)
        previousStep.step -= 1;
    } else {
      const nextSteps = await this.approvalStepRepository.find(
        { tenant, step: { $gte: atStep, $lt: step } },
      );

      for (const nextStep of nextSteps)
        nextStep.step += 1;
    }

    approvalStep.step = atStep;

    await this.approvalStepRepository.flush();
    await this.tenantRepository.populate(tenant, [
      // 'approvalSteps', 'approvalSteps.users'
    ]);

    return tenant;
  }

  public async remove(id: number): Promise<void> {
    const approvalStep = await this.approvalStepRepository.findOneOrFail({ id });
    await this.approvalStepRepository.removeAndFlush(approvalStep);
  }

  public async addUser(id: number, userId: string): Promise<ApprovalStep> {
    const approvalStep = await this.approvalStepRepository.findOneOrFail(
      { id },
      { populate: ['users'] },
    );

    const user = await this.userRepository.findOneOrFail({ id: userId });
    if (approvalStep.users.contains(user))
      throw new BadRequestException('User already in Approval Step');

    approvalStep.users.add(user);

    await this.approvalStepRepository.flush();
    return approvalStep;
  }

  public async removeUser(tenant: Tenant, id: number, userId: string): Promise<void> {
    const approvalStep = await this.approvalStepRepository.findOneOrFail(
      { id, tenant },
      { populate: ['users'] },
    );

    const user = await this.userRepository.findOneOrFail({ id: userId });
    if (!approvalStep.users.contains(user))
      throw new BadRequestException('User not in Approval Step');

    approvalStep.users.remove(user);

    await this.approvalStepRepository.flush();
  }
}
