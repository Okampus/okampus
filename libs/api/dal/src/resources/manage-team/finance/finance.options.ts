import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { FinanceProps } from '@okampus/shared/dtos';
import { TeamMember } from '../../membership/team-member/team-member.entity';
import { TenantEvent } from '../../content-master/event/event.entity';
import { Team } from '../../org/team/team.entity';
import { Project } from '../project/project.entity';
import { DocumentUpload } from '../../file-upload/document-upload/document-upload.entity';

export type FinanceOptions = FinanceProps &
  TenantScopedOptions & {
    team: Team;
    addedBy: TeamMember;
    linkedEvent?: TenantEvent;
    linkedProject?: Project;
    linkedDocuments?: DocumentUpload[];
  };
