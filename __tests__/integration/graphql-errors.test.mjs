import { UserNotFoundException } from '../../dist/user/errors/user.error.js';
import { toGraphQLError } from '@omnixys/graphql';
import { ContextAccessor } from '@omnixys/context';
import assert from 'node:assert/strict';
import test from 'node:test';

test('GraphQL maps user failures with canonical identifiers', () => {
  ContextAccessor.run(
    { requestId: 'request-graphql', correlationId: 'correlation-graphql' },
    () => {
      const error = new UserNotFoundException('user-1');
      const formatted = toGraphQLError(error);
      assert.equal(formatted.extensions.code, 'USER_NOT_FOUND');
      assert.equal(formatted.extensions.requestId, 'request-graphql');
      assert.equal(formatted.extensions.correlationId, 'correlation-graphql');
    },
  );
});
