import { apolloClient } from '../../context/apollo';
import gql from 'graphql-tag';

export function mergeCache(
  parent: { __typename: string; id: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: { fieldName: string; fragmentOn: string; data: any }
) {
  apolloClient.cache.modify({
    id: apolloClient.cache.identify({ __typename: parent.__typename, id: parent.id }),
    fields: {
      [field.fieldName]: (existingFieldData) => {
        const newFieldRef = apolloClient.cache.writeFragment({
          data: field.data,
          fragment: gql`
            fragment New${field.fragmentOn} on ${field.fragmentOn} {
              __typename
              id
            }
          `,
        });
        if (!newFieldRef) return existingFieldData;
        return Array.isArray(existingFieldData) ? [...existingFieldData, newFieldRef] : newFieldRef;
      },
    },
  });
}

export function filterCache(
  parent: { __typename: string; id: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: { fieldName: string; typename: string },
  ids: string[]
) {
  const deletedRefs = new Set(ids.map((id) => `${field.typename}:${id}`));

  apolloClient.cache.modify({
    id: apolloClient.cache.identify({ __typename: parent.__typename, id: parent.id }),
    fields: {
      [field.fieldName]: (existingFieldData) => {
        if (!Array.isArray(existingFieldData)) return existingFieldData;
        return existingFieldData.filter(({ __ref }: { __ref: string }) => !deletedRefs.has(__ref));
      },
    },
  });
}
