import type { FieldType } from 'typesense/lib/Typesense/Collection';
import { TYPESENSE_INDEX_KEY } from '../constants';

export const TypesenseIndex = (type: FieldType, facet = false): ReturnType<typeof Reflect.metadata> =>
  Reflect.metadata(TYPESENSE_INDEX_KEY, { type, facet });
