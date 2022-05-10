import partition from 'lodash.partition';
import type { InfoDoc } from '../../../files/info-docs/info-doc.entity';
import type { StudyDoc } from '../../../files/study-docs/study-doc.entity';
import type { InfoDocFilter, StudyDocFilter } from '../types/enums/docs-filters.enum';
import { groupBy } from './group-by';

export interface Category<T extends InfoDocFilter | StudyDocFilter> {
  group: string;
  name: string | null;
  context: T | '__root__';
  files: string[];
  children: Array<Category<T>>;
}

export type Categories<Document extends InfoDoc | StudyDoc> = Category<PossibleFilters<Document>>;

export type GroupFilters<Document extends InfoDoc | StudyDoc> = Readonly<Record<
  PossibleFilters<Document>,
  (elt: Document) => {
    key: string | undefined;
    metadata: string | null;
  }
>>;

type PossibleFilters<Document extends InfoDoc | StudyDoc> = Document extends InfoDoc
  ? InfoDocFilter
  : StudyDocFilter;

const getId = (doc: InfoDoc | StudyDoc): string => ('infoDocId' in doc ? doc.infoDocId : doc.studyDocId);

export function computeDocumentCategories<Document extends InfoDoc | StudyDoc>(
  allDocuments: Document[],
  groupFilters: GroupFilters<Document>,
  baseFilters: Array<PossibleFilters<Document>>,
): Categories<Document> {
  /**
   * Recursive helper method that will compute the whole tree of sub-folders based on a set of documents that is
   * reduced by a set of filters, and a set of filters that are used to group the documents.
   */
  // TODO: If performance become too much of an issue for this function, we have multiple solutions:
  //       1. Use memoization for this particular function.
  //       2. Cache the result of this function for X hours.
  //       3. Use a queue to handle the job and have a worker that will process the queue.
  const computeChildren = (
    documents: Document[],
    [currentFilter, ...nextFilters]: Array<PossibleFilters<Document>>,
  ): Array<Categories<Document>> => {
    if (!currentFilter)
      return [];

    /**
     * We group all the given documents in groups based on a given filter. For example, if the current filter is year,
     * it will likely (it depends on the groupFilters given) group the documents according to their year like so:
     *
     *   2018 => [doc1, doc2, doc3], 2019 => [doc4, doc5], 2020 => [doc6, doc7]...
     *
     * We will then use the resulting values to recursively call computeChildren on the next filter, to build the rest
     * of the tree.
     */
    const { groups } = groupBy(documents, groupFilters[currentFilter]);

    /**
     * The groups we were given are an object where the key is the name of the group, and the values are the
     * documents. Our groupBy is a little bit special, because in addition to giving you the values for the group,
     * it also gives you some metadata about the group such as a more readable name. So we extract both information
     * here, and use them later in our map callback.
     */
    return Object.entries(groups)
      .map(([group, { values, metadata }]) => {
        /**
         * If we are at the end of the filter tree (we have no more filters to apply), we just return nothing here
         * because we don't want to compute the next children, so we don't care about the usable documents or
         * leftOvers. On the other hand, if we have more filters to apply, we need to compute the next children.
         *
         * To achieve this, we segregate the documents that fit in the next group and the ones that don't.
         *
         *   - The documents that won't fit in any of the next groups are leftovers, and are displayed here under the
         * property "files" (and we only show their IDs.)
         *   - The documents that fit in one of those groups are "usable" and are used to compute the next children.
         */
        const [usable, leftOvers] = nextFilters.length === 0
          ? [[], []]
          // @ts-expect-error: currentFilter can be used as a key for the documents
          : partition(values, document => currentFilter in document && nextFilters[0] && document[nextFilters[0]]);

        /**
         * This is where the magic happens! Everything was pre-computed, so here we can just build our object easily
         * and return it. The object contains the group's ID, the group's metadata, which will, in our case, be the
         * readable group's name, the context (aka the filter used for this node), the files (aka the documents that fit
         * in none of the children groups), and the children (aka the sub-folders).
         */
        return {
          group,
          name: metadata,
          context: currentFilter,
          files: leftOvers.map(getId),
          children: computeChildren(usable, nextFilters),
        };
      });
  };

  /**
   * Get the list of document that fit in a top-level sub-folder, and the ones that don't.
   */
  const [usable, leftOvers] = partition(
    allDocuments,
    // @ts-expect-error: baseFilters[0] can be used as a key for the documents
    document => baseFilters[0] in document && document[baseFilters[0]],
  );

  /**
   * We first create the first node which is a bit special because it regroups all sub-folder, and the
   * files that don't fit in any of the top-level sub-folders. We can then just recursively call
   * computeChildren to create the rest of the tree.
   */
  return {
    group: '__root__',
    name: '/',
    context: '__root__',
    files: leftOvers.map(getId),
    children: computeChildren(usable, baseFilters),
  };
}
