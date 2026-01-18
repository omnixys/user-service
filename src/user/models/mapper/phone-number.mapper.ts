import type { PhoneNumber } from '../../../prisma/generated/client.js';
import { n2u } from '../../utils/null-to-undefined.js';
import type { PhoneNumberType } from '../enums/phone-number-type.enum.js';
import type { PhoneNumberPayload } from '../payload/phone-number.payload.js';

export class PhoneNumberMapper {
  static toPayload(user: PhoneNumber): PhoneNumberPayload {
    return {
      id: user.id,
      number: user.number,
      type: user.type as PhoneNumberType,
      infoId: user.infoId,
      label: n2u(user.label),
      isPrimary: user.isPrimary,
    };
  }

  static toPayloadList(list: PhoneNumber[]): PhoneNumberPayload[] {
    return list.map((user) => this.toPayload(user));
  }
}
