import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { config } from '../../shared/configs/config';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import type { ValidationStepType } from '../../shared/lib/types/enums/validation-step-type.enum';
import { User } from '../../users/user.entity';
import { Configuration } from '../configurations/configurations.entity';
import type { CreateValidationStepDto } from './dto/create-validation-step.dto';
import type { UpdateValidationStepDto } from './dto/update-validation-step.dto';
import { ValidationStep } from './validation-step.entity';

@Injectable()
export class ValidationStepsService {
  constructor(
    @InjectRepository(Configuration) private readonly configurationRepository: BaseRepository<Configuration>,
    @InjectRepository(ValidationStep) private readonly validationStepRepository: BaseRepository<ValidationStep>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
  ) {}

  public async create(createValidationStepDto: CreateValidationStepDto): Promise<ValidationStep> {
    const configuration = await this.configurationRepository.findOneOrFail(
      { id: config.get('productName') },
      { failHandler: () => { throw new InternalServerErrorException('Configuration not found'); } },
    );

    const step = await this.validationStepRepository.count({ configuration, step: createValidationStepDto.step });
    if (step > 0)
      throw new BadRequestException('Step already exists');

    const { users: wantedUsers, ...dto } = createValidationStepDto;
    const validationStep = new ValidationStep({ ...dto, configuration });

    const users = await this.userRepository.find({ id: { $in: wantedUsers } });
    validationStep.users.add(...users);

    await this.validationStepRepository.persistAndFlush(validationStep);
    return validationStep;
  }

  public async findAll(type: ValidationStepType): Promise<ValidationStep[]> {
    return await this.validationStepRepository.find(
      { configuration: { id: config.get('productName') }, type },
      { orderBy: { step: 'ASC' }, populate: ['users'] },
    );
  }

  public async update(id: number, updateValidationStepDto: UpdateValidationStepDto): Promise<ValidationStep> {
    const validationStep = await this.validationStepRepository.findOneOrFail({
      id,
      configuration: { id: config.get('productName') },
    });

    wrap(validationStep).assign(updateValidationStepDto);
    await this.validationStepRepository.flush();
    return validationStep;
  }

  public async remove(id: number): Promise<void> {
    const validationStep = await this.validationStepRepository.findOneOrFail({
      id,
      configuration: { id: config.get('productName') },
    });
    await this.validationStepRepository.removeAndFlush(validationStep);
  }

  public async addUser(id: number, userId: string): Promise<ValidationStep> {
    const validationStep = await this.validationStepRepository.findOneOrFail(
      { id, configuration: { id: config.get('productName') } },
      { populate: ['users'] },
    );

    const user = await this.userRepository.findOneOrFail({ id: userId });
    if (validationStep.users.contains(user))
      throw new BadRequestException('User already in Validation Step');

    validationStep.users.add(user);

    await this.validationStepRepository.flush();
    return validationStep;
  }

  public async removeUser(id: number, userId: string): Promise<void> {
    const validationStep = await this.validationStepRepository.findOneOrFail(
      { id, configuration: { id: config.get('productName') } },
      { populate: ['users'] },
    );

    const user = await this.userRepository.findOneOrFail({ id: userId });
    if (!validationStep.users.contains(user))
      throw new BadRequestException('User not in Validation Step');

    validationStep.users.remove(user);

    await this.validationStepRepository.flush();
  }
}
