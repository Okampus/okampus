
import { ApolloError } from 'apollo-server-express';

export class NotFoundError extends ApolloError {
  // eslint-disable-next-line unicorn/custom-error-definition
  constructor(message: string) {
    super(message, 'NOT_FOUND_ERROR');
    Object.defineProperty(this, 'name', { value: 'NotFoundError' });
  }
}
