import type { SecurityQuestion } from '../../../prisma/generated/client.js';
import { n2u } from '../../utils/null-to-undefined.js';
import type { FullSecurityQuestionPayload } from '../payload/security-question.payload.js';

export class FullSecurityQuestionMapper {
  static toPayload(q: SecurityQuestion): FullSecurityQuestionPayload {
    return {
      id: q.id,
      question: q.question,
      attempts: q.attempts,
      lockedAt: n2u(q.lockedAt),
      answerHash: q.answerHash,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
    };
  }

  static toPayloadList(
    list: SecurityQuestion[],
  ): FullSecurityQuestionPayload[] {
    return list.map((security) => this.toPayload(security));
  }
}
