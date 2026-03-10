import type { CustomerInterest } from '../../../prisma/generated/client.js';
import { n2u } from '../../utils/null-to-undefined.js';
import type { CustomerInterestPayload } from '../payload/customer-interest.payload.js';

export class CustomerInterestMapper {
  static toPayload(
    customerInterest: CustomerInterest,
  ): CustomerInterestPayload {
    return {
      id: customerInterest.id,
      customerId: customerInterest.customerId,
      interestId: customerInterest.interestId,
      level: n2u(customerInterest.level),
      isPrimary: customerInterest.isPrimary,
      createdAt: customerInterest.createdAt,
    };
  }

  static toPayloadList(list: CustomerInterest[]): CustomerInterestPayload[] {
    return list.map((customerInterest) => this.toPayload(customerInterest));
  }
}
