import type { OidcInfo } from '../../../../embeds/oidc.embed';
import type { IBase } from '../../../base.interface';

export interface ITenantCore extends IBase {
  domain: string;
  name: string;
  oidcInfo: OidcInfo;
}
