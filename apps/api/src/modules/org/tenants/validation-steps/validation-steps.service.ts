import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '@meta/shared/lib/orm/base.repository';
import type { ValidationStepType } from '@meta/shared/lib/types/enums/validation-step-type.enum';
import type { CreateValidationStepDto } from '@modules/org/tenants/validation-steps/dto/create-validation-step.dto';
import { User } from '@modules/uua/users/user.entity';
import { Tenant } from '../tenant.entity';
import type { UpdateValidationStepDto } from './dto/update-validation-step.dto';
import { ValidationStep } from './validation-step.entity';

@Injectable()
export class ValidationStepsService {
  constructor(
    @InjectRepository(Tenant) private readonly tenantRepository: BaseRepository<Tenant>,
    @InjectRepository(ValidationStep) private readonly validationStepRepository: BaseRepository<ValidationStep>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
  ) {}

  public async create(tenant: Tenant, createValidationStepDto: CreateValidationStepDto): Promise<ValidationStep> {
    const step = await this.validationStepRepository.count({ tenant, step: createValidationStepDto.step });
    if (step > 0)
      throw new BadRequestException('Step already exists');

    const { users: wantedUsers, ...dto } = createValidationStepDto;
    const validationStep = new ValidationStep({ ...dto, tenant });

    const users = await this.userRepository.find({ id: { $in: wantedUsers } });
    validationStep.users.add(...users);

    await this.validationStepRepository.persistAndFlush(validationStep);
    return validationStep;
  }

  public async findAll(tenant: Tenant, type: ValidationStepType): Promise<ValidationStep[]> {
    return await this.validationStepRepository.find(
      { tenant, type },
      { orderBy: { step: 'ASC' }, populate: ['users'] },
    );
  }

  public async update(id: number, updateValidationStepDto: UpdateValidationStepDto): Promise<ValidationStep> {
    const validationStep = await this.validationStepRepository.findOneOrFail({ id }, { populate: ['users'] });

    const { users, ...updateProps } = updateValidationStepDto;
    if (users) {
      if (users.length === 0) {
        validationStep.users.removeAll();
      } else {
        const newUsers = await this.userRepository.find({ id: { $in: users } });
        validationStep.users.set(newUsers);
      }
    }

    wrap(validationStep).assign(updateProps);
    await this.validationStepRepository.flush();
    return validationStep;
  }

  public async insertStep(tenant: Tenant, step: number, atStep: number): Promise<Tenant> {
    const stepCount = await this.validationStepRepository.count({ tenant });
    if (step === atStep || step < 1 || step > stepCount || step < 1 || atStep > stepCount)
      throw new BadRequestException('Invalid step numbers');

    const validationStep = await this.validationStepRepository.findOneOrFail({ tenant, step });
    if (step < atStep) {
      const previousSteps = await this.validationStepRepository.find(
        { tenant, step: { $gt: step, $lte: atStep } },
      );

      for (const previousStep of previousSteps)
        previousStep.step -= 1;
    } else {
      const nextSteps = await this.validationStepRepository.find(
        { tenant, step: { $gte: atStep, $lt: step } },
      );

      for (const nextStep of nextSteps)
        nextStep.step += 1;
    }

    validationStep.step = atStep;

    await this.validationStepRepository.flush();
    await this.tenantRepository.populate(tenant, [
      // 'validationSteps', 'validationSteps.users'
    ]);

    return tenant;
  }

  public async remove(id: number): Promise<void> {
    const validationStep = await this.validationStepRepository.findOneOrFail({ id });
    await this.validationStepRepository.removeAndFlush(validationStep);
  }

  public async addUser(id: number, userId: string): Promise<ValidationStep> {
    const validationStep = await this.validationStepRepository.findOneOrFail(
      { id },
      { populate: ['users'] },
    );

    const user = await this.userRepository.findOneOrFail({ id: userId });
    if (validationStep.users.contains(user))
      throw new BadRequestException('User already in Validation Step');

    validationStep.users.add(user);

    await this.validationStepRepository.flush();
    return validationStep;
  }

  public async removeUser(tenant: Tenant, id: number, userId: string): Promise<void> {
    const validationStep = await this.validationStepRepository.findOneOrFail(
      { id, tenant },
      { populate: ['users'] },
    );

    const user = await this.userRepository.findOneOrFail({ id: userId });
    if (!validationStep.users.contains(user))
      throw new BadRequestException('User not in Validation Step');

    validationStep.users.remove(user);

    await this.validationStepRepository.flush();
  }
}
