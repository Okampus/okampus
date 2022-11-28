import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { MembershipRequestDirection } from '@common/lib/types/enums/membership-request-direction.enum';
import { MembershipRequestState } from '@common/lib/types/enums/membership-request-state.enum';
import { TeamRole } from '@common/lib/types/enums/team-role.enum';
import { TeamManagedMembershipRequestUpdatedNotification } from '@common/modules/notifications/notifications';
import { NotificationsService } from '@common/modules/notifications/notifications.service';
import type { PaginatedResult } from '@common/modules/pagination';
import { normalizePagination } from '@common/modules/pagination';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import type { CreateTeamMembershipRequestDto } from '@modules/org/teams/requests/dto/create-membership-request.dto';
import type { User } from '@modules/uaa/users/user.entity';
import { MembershipRequestIssuer } from '../../../../common/lib/types/enums/membership-request-issuer.enum';
import type { ListMembershipRequestsDto } from '../dto/membership-requests-list-options.dto';
import { TeamMember } from '../members/team-member.entity';
import { Team } from '../team.entity';
import type { PutTeamMembershipRequestDto } from './dto/put-membership-request.dto';
import type { UpdateTeamMembershipRequestDto } from './dto/update-membership-request.dto';
import { TeamMembershipRequest } from './team-membership-request.entity';

@Injectable()
export class TeamMembershipRequestsService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(TeamForm) private readonly teamFormRepository: BaseRepository<TeamForm>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamMembershipRequest) private readonly requestRepository: BaseRepository<TeamMembershipRequest>,
    private readonly notificationsService: NotificationsService,
  ) {}

  public async create(
    requester: User,
    id: number,
    createTeamMembershipRequestDto: CreateTeamMembershipRequestDto,
  ): Promise<TeamMembershipRequest> {
    // 1. Check that the given team exist, and fetch it.
    const team = await this.teamRepository.findOneOrFail(
      { id },
      { populate: ['members'] },
    );

    // 2. Check that the user is not already in the team.
    const existing = await this.teamMemberRepository.findOne({ team, user: requester });
    if (existing)
      throw new BadRequestException('User already in team');

    // 3. Check that the user has not already requested to join the team (BadRequest),
    // or has been invited to the team (Conflict)
    const existingRequest = await this.requestRepository.findOne({
      team,
      user: requester,
      state: MembershipRequestState.Pending,
    });
    if (existingRequest) {
      // eslint-disable-next-line unicorn/prefer-ternary
      if (existingRequest.issuer === MembershipRequestIssuer.User)
        throw new BadRequestException('User already requested');
      else
        throw new ConflictException('Pending user invitation');
    }

    // 4. Check that the form is valid
    const formFields = await this.getAndValidateFormSubmission(
      team.membershipRequestForm,
      createTeamMembershipRequestDto.originalFormId,
      createTeamMembershipRequestDto.formSubmission,
      false,
    );

    // 5. Create the request.
    const teamMembershipRequest = new TeamMembershipRequest({
      team,
      ...formFields,
      user: requester,
      issuedBy: requester,
      issuer: MembershipRequestIssuer.User,
      role: createTeamMembershipRequestDto.role,
    });
    await this.requestRepository.persistAndFlush(teamMembershipRequest);

    // 6. Send a notification to the team.
    void this.notificationsService.trigger(new TeamManagedMembershipRequestUpdatedNotification(teamMembershipRequest));

    return teamMembershipRequest;
  }

  public async findAll(
    id: number,
    options?: ListMembershipRequestsDto,
  ): Promise<PaginatedResult<TeamMembershipRequest>> {
    let query: FilterQuery<TeamMembershipRequest> = {};

    if (options?.state)
      query = { ...query, state: options.state };
    if (options?.type === MembershipRequestDirection.Incoming)
      query = { ...query, issuer: MembershipRequestIssuer.Team };
    else if (options?.type === MembershipRequestDirection.Outgoing)
      query = { ...query, issuer: MembershipRequestIssuer.User };

    return await this.requestRepository.findWithPagination(
      normalizePagination(options ?? {}),
      { team: { id }, ...query },
      { orderBy: { createdAt: 'DESC' }, populate: ['team', 'user', 'issuedBy', 'handledBy', 'originalForm'] },
    );
  }

  public async update(
    user: User,
    id: number,
    updateTeamMembershipRequestDto: UpdateTeamMembershipRequestDto,
  ): Promise<TeamMembershipRequest> {
    const request = await this.requestRepository.findOneOrFail(
      { id },
      { populate: ['team', 'team.members', 'user'] },
    );

    // 1. Check that the request is still pending
    if (request.state !== MembershipRequestState.Pending)
      throw new BadRequestException('Request already handled');

    // 2. Check that the user is either the issuer of the request, or a team admin
    if (request.issuer === MembershipRequestIssuer.User && request.user !== user && !request.team.canAdminister(user))
      throw new BadRequestException('Not a team admin');

    // 3. Check that the form is valid
    const formFields = await this.getAndValidateFormSubmission(
      request.team.membershipRequestForm,
      updateTeamMembershipRequestDto.originalFormId,
      updateTeamMembershipRequestDto.formSubmission,
      true,
    );

    wrap(request).assign({ ...updateTeamMembershipRequestDto, ...formFields });
    await this.requestRepository.flush();

    return request;
  }

  public async handleRequest(
    user: User,
    id: number,
    updateTeamMembershipRequestDto: PutTeamMembershipRequestDto,
  ): Promise<TeamMembershipRequest> {
    const request = await this.requestRepository.findOneOrFail(
      { id },
      { populate: ['team', 'team.members', 'user', 'issuedBy', 'handledBy', 'originalForm'] },
    );

    if (request.state !== MembershipRequestState.Pending)
      throw new BadRequestException('Request already handled');

    // If it was requested by a user, then we have to check that the persone handling it in the team
    // has the permission to do so.
    if (request.issuer === MembershipRequestIssuer.User) {
      if (!request.team.canAdminister(user))
        throw new BadRequestException('Not a team admin');

      if (request.role === TeamRole.Owner) {
        const handlerMember = await this.teamMemberRepository.findOneOrFail({ user });
        if (handlerMember.role !== TeamRole.Owner)
          throw new BadRequestException('Not the owner');
        else if (updateTeamMembershipRequestDto.state === MembershipRequestState.Approved)
          handlerMember.role = TeamRole.Coowner;
      }
    }

    request.handledBy = user;
    request.handledAt = new Date();
    request.handledMessage = updateTeamMembershipRequestDto.handledMessage ?? null;
    request.state = updateTeamMembershipRequestDto.state;
    await this.requestRepository.flush();

    if (updateTeamMembershipRequestDto.state === MembershipRequestState.Approved) {
      const teamMember = new TeamMember({ team: request.team, user: request.user, role: request.role });
      this.teamMemberRepository.persist(teamMember);
      await this.teamMemberRepository.flush();

      request.team.activeMemberCount++;
      await this.teamRepository.flush();
    }

    void this.notificationsService.trigger(new TeamManagedMembershipRequestUpdatedNotification(request));

    return request;
  }

  private async getAndValidateFormSubmission(
    teamForm?: TeamForm | null,
    askedFormId?: number | null,
    formSubmission?: object[] | object | null,
    canOmitFields = false,
  ): Promise<{ formSubmission?: object[] | object | null; originalForm?: TeamForm | null }> {
    // Step 1 — don't change anything as nothing was asked
    if (canOmitFields && typeof askedFormId === 'undefined' && typeof formSubmission === 'undefined')
      return {};

    // If the default form was used, we don't need to validate it
    // TODO: formalize default forms (shared in monorepo) for validation
    if (formSubmission && !teamForm && !askedFormId)
      return { formSubmission, originalForm: null };

    // Step 2 — update the form submission / original form only if they are both defined,
    // and there is an actual form required
    if (teamForm && askedFormId && formSubmission) {
      if (askedFormId !== teamForm.id)
        throw new BadRequestException('Wrong form');

      const form = await this.teamFormRepository.findOneOrFail({ id: askedFormId });
      if (form.isTemplate)
        throw new BadRequestException('Form is a template');

      return { formSubmission, originalForm: form };
    }

    // Step 3 + Step 4 + Step 5 — We cannot update the form submission / original form individually,
    // and even less if there is a required form
    if (teamForm || askedFormId || formSubmission)
      throw new BadRequestException('Invalid form entries');

    // Step 6 — Either one of form submission / original form are all null, so we set them all to null
    return { formSubmission: null, originalForm: null };
  }
}
