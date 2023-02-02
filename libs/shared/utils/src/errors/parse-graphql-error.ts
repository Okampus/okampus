import { ApolloError } from '@apollo/client';

export function parseGraphqlError(error: ApolloError | undefined) {
  if (!error) {
    return '';
  }
  const { graphQLErrors, networkError, message } = error;
  if (networkError || message.includes('NetworkError')) {
    return "Le serveur n'est pas joignable pour le moment. Veuillez réessayer plus tard.";
  }

  if (graphQLErrors) {
    return graphQLErrors.map((e) => e.message).join('');
  }

  return message;
}
