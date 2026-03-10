import type { PhoneNumber } from '../../../prisma/generated/client.js';
import { n2u } from '../../utils/null-to-undefined.js';
import type { PhoneNumberPayload } from '../payload/phone-number.payload.js';
import type { PhoneNumberType } from '@omnixys/contracts';

export class PhoneNumberMapper {
  static toPayload(phoneNumber: PhoneNumber): PhoneNumberPayload {
    return {
      id: phoneNumber.id,
      number: phoneNumber.number,
      type: phoneNumber.type as PhoneNumberType,
      infoId: phoneNumber.infoId,
      label: n2u(phoneNumber.label),
      isPrimary: phoneNumber.isPrimary,
      countryCode: phoneNumber.countryCode,
      updatedAt: phoneNumber.updatedAt,
      createdAt: phoneNumber.createdAt,
    };
  }

  static toPayloadList(list: PhoneNumber[]): PhoneNumberPayload[] {
    return list.map((user) => this.toPayload(user));
  }
}
