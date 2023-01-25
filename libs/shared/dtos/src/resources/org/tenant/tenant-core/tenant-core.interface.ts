import { OidcInfo } from '../../../../embeds/oidc.embed';
import { IBaseEntity } from '../../../base.interface';

export interface ITenantCore extends IBaseEntity {
  domain: string;
  name: string;
  oidcInfo: OidcInfo;
}
