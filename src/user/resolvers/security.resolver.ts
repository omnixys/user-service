/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  CurrentUser,
  CurrentUserData,
} from '../../auth/decorators/current-user.decorator.js';
import { CookieAuthGuard } from '../../auth/guards/cookie-auth.guard.js';
import { AddSecurityQuestionInput } from '../models/input/security-question.input.js';
import { SendPasswordResetInput } from '../models/input/send-password-reset.input.js';
import { VerifySecurityQuestionInput } from '../models/input/verify-security-question.input.js';
import { FullSecurityQuestionMapper } from '../models/mapper/security.mapper.js';
import {
  FullSecurityQuestionPayload,
  SecurityQuestionPayload,
} from '../models/payload/security-question.payload.js';
import { VerifySecurityQuestionPayload } from '../models/payload/verify-security-question.payload.js';
import { SecurityService } from '../services/security.service.js';
import {
  ForbiddenException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';

/* ------------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------- */
// function normalizeIp(ip?: string): string | undefined {
//   if (!ip) return undefined;
//   return ip.startsWith('::ffff:') ? ip.substring(7) : ip;
// }

// function extractClientIp(ctx: { req?: any }): string | undefined {
//   const req = ctx.req;
//   if (!req) return undefined;

//   const forwarded = req.headers?.['x-forwarded-for'];
//   if (typeof forwarded === 'string') {
//     const first = forwarded.split(',')[0];
//     return first ? normalizeIp(first.trim()) : undefined;
//   }

//   return normalizeIp(req.ip ?? req.socket?.remoteAddress);
// }

function extractResetToken(ctx: any): string {
  const req = ctx?.req;
  if (!req) {
    throw new ForbiddenException('Missing request context');
  }

  // 1) Query param (preferred)
  const tokenFromQuery = req.query?.token;
  if (typeof tokenFromQuery === 'string' && tokenFromQuery.length > 0) {
    return tokenFromQuery;
  }

  // 2) Authorization header (optional)
  const authHeader = req.headers?.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim();
    if (token.length > 0) {
      return token;
    }
  }

  throw new ForbiddenException('Reset token missing');
}

/* ------------------------------------------------------------
 * Resolver
 * ---------------------------------------------------------- */

@Resolver(() => FullSecurityQuestionPayload)
export class SecurityResolver {
  constructor(private readonly securityService: SecurityService) {}

  /* ==========================================================
   * Add Security Question (authenticated)
   * ======================================================== */
  @Mutation(() => FullSecurityQuestionPayload)
  @UseGuards(CookieAuthGuard)
  async addSecurityQuestion(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('input') input: AddSecurityQuestionInput,
  ): Promise<FullSecurityQuestionPayload> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }

    const entity = await this.securityService.addQuestion(
      input,
      currentUser.id,
    );

    return FullSecurityQuestionMapper.toPayload(entity);
  }

  /* ==========================================================
   * Get 3 Security Questions for Verification (public)
   * ======================================================== */
  @Query(() => [FullSecurityQuestionPayload])
  async getSecurityVerificationQuestions(
    @Context() ctx: any,
  ): Promise<SecurityQuestionPayload[]> {
    const token = extractResetToken(ctx);
    const email = await this.securityService.resolveEmailFromResetToken(token);

    return this.securityService.getVerificationQuestions(email);
  }

  /* ==========================================================
   * Verify 3 Questions & Reset Password
   * ======================================================== */
  @Mutation(() => VerifySecurityQuestionPayload)
  async verifySecurityQuestionsAndResetPassword(
    @Context() ctx: any,
    @Args({ name: 'answers', type: () => [VerifySecurityQuestionInput] })
    answers: VerifySecurityQuestionInput[],
  ): Promise<VerifySecurityQuestionPayload> {
    const token = extractResetToken(ctx);

    const result = await this.securityService.verifyQuestionsAndResetPassword({
      token,
      answers,
    });

    return {
      success: result.success,
    };
  }

  /* ==========================================================
   * Send Password Reset Email
   * ======================================================== */
  @Mutation(() => Boolean)
  async sendPasswordResetEmail(
    @Args('input') input: SendPasswordResetInput,
    // @Context() ctx: any,
  ): Promise<boolean> {
    // const ipAddress = extractClientIp(ctx);

    await this.securityService.sendPasswordResetNotification({
      email: input.email,
      resetUrl: input.resetUrl,
    });

    return true;
  }
}
