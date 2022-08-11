import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import type { ValidationStepType } from '../../shared/lib/types/enums/validation-step-type.enum';
import { User } from '../../users/user.entity';
import { Tenant } from '../tenants/tenant.entity';
import type { CreateValidationStepDto } from './dto/create-validation-step.dto';
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
    const validationStep = await this.validationStepRepository.findOneOrFail({ id });

    wrap(validationStep).assign(updateValidationStepDto);
    await this.validationStepRepository.flush();
    return validationStep;
  }

  public async switchSteps(tenant: Tenant, step1: number, step2: number): Promise<Tenant> {
    const stepCount = await this.validationStepRepository.count({ tenant });
    if (step1 === step2 || step1 < 0 || step1 >= stepCount || step2 < 0 || step2 >= stepCount)
      throw new BadRequestException('Invalid step numbers');

    const validationStep1 = await this.validationStepRepository.findOneOrFail({ step: step1, tenant });
    const validationStep2 = await this.validationStepRepository.findOneOrFail({ step: step2, tenant });

    validationStep1.step = step2;
    validationStep2.step = step1;

    await this.validationStepRepository.flush();

    return this.tenantRepository.findOneOrFail({ id: tenant.id }, { populate: ['validationSteps'] });
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
