import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import type { PaginationOptions } from '../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { User } from '../users/user.entity';
import { ClubMember } from './club-member.entity';
import { Club } from './club.entity';
import type { CreateClubMemberDto } from './dto/create-club-member.dto';
import type { CreateClubDto } from './dto/create-club.dto';
import type { UpdateClubMemberDto } from './dto/update-club-member.dto';
import type { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club) private readonly clubRepository: BaseRepository<Club>,
    @InjectRepository(ClubMember) private readonly clubMemberRepository: BaseRepository<ClubMember>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    ) {}

  public async create(createClubDto: CreateClubDto): Promise<Club> {
    const club = new Club(createClubDto);

    try {
      await this.clubRepository.persistAndFlush(club);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Badge already exists');
      throw error;
    }

    return club;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<Club>> {
    return await this.clubRepository.findWithPagination(paginationOptions);
  }

  public async findOne(clubId: number): Promise<Club> {
    return await this.clubRepository.findOneOrFail({ clubId });
  }

  public async update(clubId: number, updateClubDto: UpdateClubDto): Promise<Club> {
    const club = await this.clubRepository.findOneOrFail({ clubId });

    wrap(club).assign(updateClubDto);
    await this.clubRepository.flush();
    return club;
  }

  public async remove(clubId: number): Promise<void> {
    const club = await this.clubRepository.findOneOrFail({ clubId });
    await this.clubRepository.removeAndFlush(club);
  }

  public async findAllUsersInClub(
    clubId: number,
    paginationOptions?: PaginationOptions,
  ): Promise<PaginatedResult<ClubMember>> {
    const club = await this.clubRepository.findOneOrFail({ clubId });
    return await this.clubMemberRepository.findWithPagination(paginationOptions, { club });
  }

  public async addUserToClub(
    clubId: number,
    userId: string,
    createClubMemberDto: CreateClubMemberDto,
): Promise<ClubMember> {
    const club = await this.clubRepository.findOneOrFail({ clubId });
    const user = await this.userRepository.findOneOrFail({ userId });
    const existing = await this.clubMemberRepository.count({ club, user });
    if (existing)
      throw new BadRequestException('User is already in club');

    const clubMember = new ClubMember({ ...createClubMemberDto, club, user });
    await this.clubMemberRepository.persistAndFlush(clubMember);
    return clubMember;
  }

  public async findClubMembership(user: User): Promise<ClubMember[]> {
    return await this.clubMemberRepository.findAll(user);
  }

  public async updateUserRole(
    clubId: number,
    userId: string,
    updateClubMemberDto: UpdateClubMemberDto,
  ): Promise<ClubMember> {
    const user = await this.userRepository.findOneOrFail({ userId });
    const clubMember = await this.clubMemberRepository.findOneOrFail({ club: { clubId }, user });

    wrap(clubMember).assign(updateClubMemberDto);
    await this.clubMemberRepository.flush();
    return clubMember;
  }

  public async removeUserFromClub(clubId: number, user: User): Promise<void> {
    const clubMember = await this.clubMemberRepository.findOneOrFail({ club: { clubId }, user });
    await this.clubMemberRepository.removeAndFlush(clubMember);
  }
}
