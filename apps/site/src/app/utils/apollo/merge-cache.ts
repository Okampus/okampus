import { apolloClient } from '#site/app/providers/apollo.client';
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
        return Array.isArray(existingFieldData) ? [...existingFieldData, newFieldRef] : newFieldRef;
      },
    },
  });
}
