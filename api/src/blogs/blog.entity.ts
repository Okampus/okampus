import { Entity, Property } from '@mikro-orm/core';
import { Transform } from 'class-transformer';
import type { Content } from '../contents/entities/content.entity';
import { ContentMaster } from '../shared/lib/entities/content-master.entity';
import { ContentMasterType } from '../shared/lib/types/enums/content-master-type.enum';

@Entity({ discriminatorValue: ContentMasterType.Blog })
export class Blog extends ContentMaster {
  @Property({ type: 'text' })
  slug!: string;

  @Property({ type: 'text' })
  title!: string;

  @Property({ type: 'text' })
  category!: string;

  @Property({ type: 'text' })
  locationName?: string;

  @Property({ type: 'text' })
  @Transform(({ obj }: { obj: Blog }) => obj.location?.split(','))
  location?: string;

  @Property()
  locked = false;

  // TODO: Add full 'draft' support
  @Property()
  isDraft = false;

  constructor(options: {
    title: string;
    slug: string;
    category: string;
    isDraft: boolean;
    post?: Content;
    location?: [lat: number, lon: number];
    locationName?: string;
  }) {
    super(options);
    this.title = options.title;
    this.slug = options.slug;
    this.category = options.category;
    this.isDraft = options.isDraft;
    if (options.location)
      this.location = options.location.join(',');
    if (options.locationName)
      this.locationName = options.locationName;
  }
}
