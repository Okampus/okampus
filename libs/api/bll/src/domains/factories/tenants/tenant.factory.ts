import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Form, Individual, Tag, Tenant, TenantCore, TenantOptions, TenantRepository } from '@okampus/api/dal';
import { CreateTenantDto, ITenant } from '@okampus/shared/dtos';
import { FormType } from '@okampus/shared/enums';
import { loadTenant } from '../loader.utils';
import { BaseFactory } from '../base.factory';
import { TenantModel } from './tenant.model';

@Injectable()
export class TenantFactory extends BaseFactory<TenantModel, Tenant, ITenant, TenantOptions> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, tenantRepository: TenantRepository) {
    super(ep, tenantRepository, TenantModel, Tenant);
  }

  async createTenant(createTenant: CreateTenantDto, individual: Individual): Promise<TenantModel> {
    const tenantCore = new TenantCore({
      name: createTenant.tenant.name,
      domain: createTenant.tenant.domain,
      oidcInfo: createTenant.tenant.oidcInfo,
    });

    const tenantOptions = {
      tenant: tenantCore,
      name: createTenant.name,
      slug: createTenant.slug,
      bio: createTenant.bio,
      parent: null,
      primaryEmail: createTenant.primaryEmail,
      tags: [],
    };

    return await this.create(tenantOptions, async (tenantEntity) => {
      if (createTenant.eventValidationForm) {
        tenantEntity.eventValidationForm = new Form({
          name: "Formulaire de validation d'événement",
          type: FormType.Internal,
          schema: createTenant.eventValidationForm,
          isTemplate: false,
          realAuthor: individual,
          tenant: tenantCore,
        });
      }
      return tenantEntity;
    });
  }

  entityToModel(entity: Tenant): TenantModel | undefined {
    const tenant = loadTenant(entity);
    if (!tenant) return undefined;
    return this.createModel(tenant);
  }

  modelToEntity(model: Required<TenantModel>): Tenant {
    return new Tenant({
      ...model,
      ...model.actor,
      tenant: { id: model.tenant.id } as TenantCore,
      tags: model.actor.tags.map((tag) => ({ id: tag.id } as Tag)),
      parent: null,
      eventValidationForm: { id: model.eventValidationForm.id } as Form,
    });
  }
}
