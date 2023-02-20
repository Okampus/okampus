import { CurrentContext } from '../contexts/CurrentContext';
import { gql, useApolloClient } from '@apollo/client';
import { useCallback, useContext, useState } from 'react';
import type { MyInfoFragment, TeamManageInfoFragment, TenantInfoFragment } from '@okampus/shared/graphql';

export function useCurrentContext(): [
  { user?: MyInfoFragment; org?: TeamManageInfoFragment; tenant?: TenantInfoFragment },
  () => void
] {
  const [, updateState] = useState({});
  const update = useCallback(() => updateState({}), []);

  const client = useApolloClient();
  const { currentUserId, currentOrgId, currentTenantId } = useContext(CurrentContext);

  // TODO: use readFragment once https://github.com/dotansimha/graphql-code-generator/issues/6491 is fixed

  const user = client.readFragment({
    id: `UserModel:${currentUserId}`,
    fragment: gql`
      fragment CurrentUserInfo on UserModel {
        __typename
        id
        createdAt
        updatedAt
        actor {
          id
          slug
          name
          bio
          primaryEmail
          ical
          actorImages {
            __typename
            id
            type
            image {
              __typename
              id
              url
            }
          }
        }
        firstName
        lastName
        roles
        scopeRole
        shortcuts {
          __typename
          id
          type
          targetActor {
            __typename
            id
            actorKind
            name
            slug
            actorImages {
              __typename
              id
              type
              image {
                __typename
                id
                url
              }
            }
            org {
              __typename
              ... on TeamModel {
                id
                createdAt
                updatedAt
                tagline
                type
                currentFinance
                actor {
                  __typename
                  id
                  name
                  slug
                  actorImages {
                    __typename
                    id
                    type
                    image {
                      __typename
                      id
                      url
                    }
                  }
                }
                documents {
                  __typename
                  id
                  type
                  document {
                    __typename
                    id
                    createdAt
                    name
                    yearVersion
                    documentUpload {
                      __typename
                      id
                      createdAt
                      url
                      name
                      mime
                      size
                      numberOfPages
                      numberOfWords
                      documentType
                    }
                    edits {
                      __typename
                      id
                      createdAt
                      yearVersion
                      documentUpload {
                        __typename
                        id
                        createdAt
                        url
                        name
                        mime
                        size
                        numberOfPages
                        numberOfWords
                        documentType
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
  });

  const org = client.readFragment({
    id: `TeamModel:${currentOrgId}`,
    fragment: gql`
      fragment CurrentTeamInfo on TeamModel {
        __typename
        id
        createdAt
        updatedAt
        tagline
        type
        currentFinance
        actor {
          __typename
          id
          name
          slug
          actorImages {
            __typename
            id
            type
            image {
              __typename
              id
              url
            }
          }
        }
        documents {
          __typename
          id
          type
          document {
            __typename
            id
            createdAt
            name
            yearVersion
            documentUpload {
              __typename
              id
              createdAt
              url
              name
              mime
              size
              numberOfPages
              numberOfWords
              documentType
            }
            edits {
              __typename
              id
              createdAt
              yearVersion
              documentUpload {
                __typename
                id
                createdAt
                url
                name
                mime
                size
                numberOfPages
                numberOfWords
                documentType
              }
            }
          }
        }
        finances {
          __typename
          id
          createdAt
          updatedAt
          transaction
          paymentDate
          paymentMethod
          amountDue
          amountPayed
          state
          category
          receipts {
            __typename
            id
            createdAt
            url
            name
            mime
            size
            numberOfPages
            numberOfWords
            documentType
          }
        }
      }
    `,
  });

  const tenant = client.readFragment({
    id: `TenantModel:${currentTenantId}`,
    fragment: gql`
      fragment CurrentTenantInfo on TenantModel {
        __typename
        id
        createdAt
        updatedAt
        actor {
          __typename
          id
          name
          slug
          actorImages {
            __typename
            id
            type
            image {
              __typename
              id
              url
            }
          }
        }
        eventValidationForm {
          __typename
          id
          schema
        }
        documents {
          __typename
          id
          type
          document {
            __typename
            id
            createdAt
            name
            yearVersion
            documentUpload {
              __typename
              id
              createdAt
              url
              name
              mime
              size
              numberOfPages
              numberOfWords
              documentType
            }
            edits {
              __typename
              id
              createdAt
              yearVersion
              documentUpload {
                __typename
                id
                createdAt
                url
                name
                mime
                size
                numberOfPages
                numberOfWords
                documentType
              }
            }
          }
        }
      }
    `,
  });

  // console.log('useCurrentContext', { user, org, tenant });
  return [{ user: user ?? undefined, org: org ?? undefined, tenant: tenant ?? undefined }, update];
}
