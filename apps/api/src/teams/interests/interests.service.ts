import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import type { PaginatedResult, PaginateDto } from '../../shared/modules/pagination';
import { User } from '../../users/user.entity';
import { Team } from '../teams/team.entity';
import type { CreateInterestDto } from './dto/create-interest.dto';
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
    console.log(teamId, userId);
    console.log(await this.teamRepository.findOne({ id: teamId }));
    console.log(await this.teamRepository.findAll());
    const team = await this.teamRepository.findOneOrFail({ id: teamId });
    console.log(team);
    const user = await this.userRepository.findOneOrFail({ id: userId });
    const interest = new Interest({
      ...createInterest,
      team,
      user,
    });
    await this.interestRepository.persistAndFlush(interest);
    return interest;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<Interest>> {
    return await this.interestRepository.findWithPagination(paginationOptions);
  }

  public async findOne(id: number): Promise<Interest> {
    return await this.interestRepository.findOneOrFail({ id });
  }

  public async findAllByTeam(id: number): Promise<Interest[]> {
    return await this.interestRepository.find({ team: { id } }, { populate: ['team', 'user'] });
  }

  public async findAllbyUser(id: string): Promise<Interest[]> {
    const restult = await this.interestRepository.find({ user: { id } }, { populate: ['team', 'user'] });
    return restult;
  }

  public async update(id: number, updateInterestDto: UpdateInterestDto): Promise<Interest> {
    const interest = await this.interestRepository.findOneOrFail({ id });
    this.interestRepository.assign(interest, updateInterestDto);
    await this.interestRepository.persistAndFlush(interest);
    return interest;
  }

  public async remove(id: number): Promise<Interest> {
    const subject = await this.interestRepository.findOneOrFail({ id });
    await this.interestRepository.removeAndFlush(subject);
    return subject;
  }
}
