import type { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { MembershipRequestDirection } from '@common/lib/types/enums/membership-request-direction.enum';
import type { PaginatedResult, PaginateDto } from '@common/modules/pagination';
import { normalizePagination } from '@common/modules/pagination';
import type { ListMembershipRequestsDto } from '../dto/membership-requests-list-options.dto';
import { TeamMember } from '../members/team-member.entity';
import { TeamMembershipRequest } from '../requests/team-membership-request.entity';
import { MembershipRequestIssuer } from '../types/membership-request-issuer.enum';

@Injectable()
export class TeamMembershipsService {
  constructor(
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamMembershipRequest)
    private readonly teamMembershipRequestRepository: BaseRepository<TeamMembershipRequest>,
  ) {}

  public async findOne(
    id: string,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<TeamMember>> {
    return await this.teamMemberRepository.findWithPagination(
      paginationOptions,
      { user: { id } },
      { populate: ['user', 'team.avatar', 'team.banner', 'team.status', 'team.location', 'team.kind', 'team.name'], orderBy: { team: { name: 'ASC' } } },
    );
  }

  public async findAll(
    id: string,
    options?: ListMembershipRequestsDto,
  ): Promise<PaginatedResult<TeamMembershipRequest>> {
    let query: FilterQuery<TeamMembershipRequest> = {};

    if (options?.state)
      query = { ...query, state: options.state };
    if (options?.type === MembershipRequestDirection.Incoming)
      query = { ...query, issuer: MembershipRequestIssuer.User };
    else if (options?.type === MembershipRequestDirection.Outgoing)
      query = { ...query, issuer: MembershipRequestIssuer.Team };

    return await this.teamMembershipRequestRepository.findWithPagination(
      normalizePagination(options ?? {}),
      { user: { id }, ...query },
      { orderBy: { createdAt: 'DESC' }, populate: ['team', 'user', 'issuedBy', 'handledBy'] },
    );
  }
}
