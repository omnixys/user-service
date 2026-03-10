/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { PersonStatus, UserType } from '@omnixys/contracts';
import type { User } from '../../../prisma/generated/client.js';
import { resolveEffectiveRole } from '../enums/role-type.enum.js';
import type { UserPayload } from '../payload/user.payload.js';

export class userMapper {
  /**
   * Filters raw Keycloak roles down to the roles your app actually cares about.
   * - Normalizes to UPPERCASE
   * - De-duplicates
   * - Whitelists only known roles
   */
  static filterRelevantRoles(raw: string[] = []): string[] {
    const ALLOWED = new Set([
      'ADMIN',
      'SECURITY',
      'GUEST',
      'EVENT_ADMIN',
      'SUPREME',
      'ELITE',
      'BASIC',
      'ANON',
    ]);

    const out: string[] = [];
    const seen = new Set<string>();

    for (const r of raw) {
      if (!r) {
        continue;
      }

      // Keycloak sometimes prefixes roles or uses different casing
      // e.g. "realm:admin", "ROLE_ADMIN", "checkpoint-api:ADMIN"
      const normalized = String(r)
        .trim()
        .toUpperCase()
        .replace(/^ROLE_/, '')
        .replace(/^REALM:/, '')
        .replace(/^CLIENT:/, '');

      // If you want to support "clientId:ROLE" patterns, keep the last segment.
      const lastSegment = normalized.includes(':')
        ? normalized.split(':').pop()!
        : normalized;

      if (!ALLOWED.has(lastSegment)) {
        continue;
      }
      if (seen.has(lastSegment)) {
        continue;
      }

      seen.add(lastSegment);
      out.push(lastSegment);
    }

    return out;
  }

  static toPayload(user: User, roles: string[] = []): UserPayload {
    return {
      id: user.id,
      username: user.username,
      userType: user.userType as UserType,
      status: user.status as PersonStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: resolveEffectiveRole(true, roles),
    };
  }

  static toPayloadList(list: User[]): UserPayload[] {
    return list.map((user) => this.toPayload(user));
  }
}
