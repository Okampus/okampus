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
  category!: string;

  @Property({ type: 'text' })
  locationName: string | null = null;

  @Property({ type: 'text' })
  @Transform(({ obj }: { obj: Blog }) => obj.location?.split(','))
  location: string | null = null;

  @Property()
  locked = false;

  @Property()
  isDraft = false;

  constructor(options: {
    title: string;
    post: Content;
    slug: string;
    category: string;
    isDraft: boolean;
    location?: [lat: number, lon: number] | null;
    locationName?: string | null;
  }) {
    super(options);
    this.assign(options);
    if (options.location)
      this.location = options.location.join(',');
  }
}
