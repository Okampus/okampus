import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import pointsConfig from '@common/configs/points.config';
import { BaseRepository } from '@common/lib/orm/base.repository';
import type { PaginatedResult, PaginateDto } from '@common/modules/pagination';
import type { CreateInterestDto } from '@modules/org/teams/interests/dto/create-interest.dto';
import { User } from '@modules/uaa/users/user.entity';
import { Team } from '../team.entity';
import type { UpdateInterestDto } from './dto/update-interest.dto';
import { Interest } from './interest.entity';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest) private readonly interestRepository: BaseRepository<Interest>,
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
  ) {}

  public async create(createInterestDto: CreateInterestDto): Promise<Interest> {
    const { teamId, userId, ...createInterest } = createInterestDto;
    const team = await this.teamRepository.findOneOrFail({ id: teamId, kind: 'Club' });
    const user = await this.userRepository.findOneOrFail({ id: userId });
    const interest = new Interest({
      ...createInterest,
      team,
      user,
    });
    await this.interestRepository.persistAndFlush(interest);
    // Check if the user has finished the onboarding process
    if (!user.finishedOnboarding) {
      const countTeam = await this.teamRepository.count({ kind: 'Club' });
      const countInterest = await this.interestRepository.count({ user: { id: userId } });
      if (countTeam === countInterest) {
        this.userRepository.assign(user, {
          finishedOnboarding: true,
          points: user.points + pointsConfig.finishedOnboarding,
          });
        await this.userRepository.persistAndFlush(user);
      }
    }

    return interest;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<Interest>> {
    return await this.interestRepository.findWithPagination(paginationOptions);
  }

  public async findOne(id: number): Promise<Interest> {
    return await this.interestRepository.findOneOrFail({ id });
  }

  public async findForUserTeam(userId: string, teamId: number): Promise<Interest | null> {
    return await this.interestRepository.findOne({ user: { id: userId }, team: { id: teamId } });
  }

  public async findAllByTeam(id: number): Promise<Interest[]> {
    return await this.interestRepository.find({ team: { id } }, { populate: ['team', 'user'] });
  }

  public async findAllbyUser(id: string): Promise<Interest[]> {
    return await this.interestRepository.find({ user: { id } }, { populate: ['team', 'user'] });
  }

  public async update(id: number, updateInterestDto: UpdateInterestDto): Promise<Interest> {
    const interest = await this.interestRepository.findOneOrFail({ id }, { populate: ['team.name'] });
    this.interestRepository.assign(interest, updateInterestDto);
    await this.interestRepository.persistAndFlush(interest);
    return interest;
  }

  public async remove(id: number): Promise<Interest> {
    const interest = await this.interestRepository.findOneOrFail({ id });
    await this.interestRepository.removeAndFlush(interest);
    return interest;
  }
}
