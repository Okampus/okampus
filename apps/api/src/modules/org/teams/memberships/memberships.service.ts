import type { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { PaginatedNodes, PaginationOptions } from '@common/modules/pagination';
import { BaseRepository } from '@lib/orm/base.repository';
import { MembershipRequestDirection } from '@lib/types/enums/membership-request-direction.enum';
import { MembershipRequestIssuer } from '@lib/types/enums/membership-request-issuer.enum';
import type { ListMembershipRequestsDto } from '@teams/dto/membership-requests-list-options.dto';
import { TeamMember } from '@teams/members/team-member.entity';
import { TeamMembershipRequest } from '@teams/requests/team-membership-request.entity';

@Injectable()
export class TeamMembershipsService {
  constructor(
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamMembershipRequest) private readonly requestRepository: BaseRepository<TeamMembershipRequest>,
  ) {}

  public async findOne(
    id: string,
    paginationOptions?: PaginationOptions,
  ): Promise<PaginatedNodes<TeamMember>> {
    return await this.teamMemberRepository.findWithPagination(
      paginationOptions,
      { user: { id } },
      {
        populate: ['user', 'team.logo', 'team.logoDark', 'team.banner', 'team.status', 'team.kind', 'team.name'],
        // FIXME: Enable orderBy with pagination
        // orderBy: { team: { name: 'ASC' } },
      },
    );
  }

  public async findAll(
    id: string,
    options?: ListMembershipRequestsDto,
  ): Promise<PaginatedNodes<TeamMembershipRequest>> {
    let query: FilterQuery<TeamMembershipRequest> = {};

    if (options?.state)
      query = { ...query, state: options.state };
    if (options?.type === MembershipRequestDirection.Incoming)
      query = { ...query, issuer: MembershipRequestIssuer.User };
    else if (options?.type === MembershipRequestDirection.Outgoing)
      query = { ...query, issuer: MembershipRequestIssuer.Team };

    return await this.requestRepository.findWithPagination(
      options,
      { user: { id }, ...query },
      // FIXME: Enable orderBy with pagination
      // { orderBy: { createdAt: 'DESC' }, populate: ['team', 'user', 'issuedBy', 'handledBy'] },
      { populate: ['team', 'user', 'issuedBy', 'handledBy'] },
    );
  }
}
