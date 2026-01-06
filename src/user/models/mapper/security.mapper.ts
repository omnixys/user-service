/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Security } from '../../../prisma/generated/client.js';
import { n2u } from '../../utils/null-to-undefined.js';
import { SecurityPayload } from '../payload/security.payload.js';

export class SecurityMapper {
  static toPayload(security: Security): SecurityPayload {
    return {
      id: security.id,
      question: security.question,
      answer: security.answer,
      answerHash: security.answerHash,
      attempts: security.attempts,
      lockedAt: n2u(security.lockedAt),
      locked: Boolean(security.lockedAt && security.lockedAt > new Date()),
      createdAt: security.createdAt,
      updatedAt: security.updatedAt,
      userId: security.userId,
    };
  }

  static toPayloadList(list: Security[]): SecurityPayload[] {
    return list.map((security) => this.toPayload(security));
  }
}
