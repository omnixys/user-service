import { UserNotFoundException } from '../../dist/user/errors/user.error.js';
import { toGraphQLError } from '@omnixys/graphql';
import { ContextAccessor } from '@omnixys/context';
import { AuthenticationRequiredException } from '@omnixys/security';
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

test('GraphQL maps missing principals to the canonical unauthorized code', () => {
  const formatted = toGraphQLError(new AuthenticationRequiredException());

  assert.equal(formatted.extensions.code, 'UNAUTHORIZED');
  assert.deepEqual(formatted.extensions.details, {});
  assert.match(formatted.extensions.timestamp, /^\d{4}-\d{2}-\d{2}T/);
});
