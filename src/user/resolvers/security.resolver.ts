/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

// security.resolver.ts
import {
  CurrentUser,
  CurrentUserData,
} from '../../auth/decorators/current-user.decorator.js';
import { CookieAuthGuard } from '../../auth/guards/cookie-auth.guard.js';
import { AddSecurityQuestionInput } from '../models/input/add-security-question.input.js';
import { SendPasswordResetInput } from '../models/input/send-password-reset.input.js';
import { VerifySecurityQuestionInput } from '../models/input/verify-security-question.input.js';
import { SecurityQuestionPayload } from '../models/payload/security-question.payload.js';
import { SecurityPayload } from '../models/payload/security.payload.js';
import { VerifySecurityQuestionPayload } from '../models/payload/verify-security-question.payload.js';
import { SecurityService } from '../services/security.service.js';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';

function normalizeIp(ip?: string): string | undefined {
  if (!ip) return undefined;
  return ip.startsWith('::ffff:') ? ip.substring(7) : ip;
}

function extractClientIp(ctx: { req?: any }): string | undefined {
  const req = ctx.req;
  if (!req) return undefined;

  const forwarded = req.headers?.['x-forwarded-for'];

  if (typeof forwarded === 'string') {
    const first = forwarded.split(',')[0];
    return first ? normalizeIp(first?.trim()) : undefined;
  }

  return req.ip ?? req.socket?.remoteAddress ?? undefined;
}

function extractResetToken(ctx: any): string {
  const req = ctx?.req;
  if (!req) {
    throw new ForbiddenException('Missing request context');
  }

  // 1) Query param (Standard & empfohlen)
  const tokenFromQuery = req.query?.token;
  if (typeof tokenFromQuery === 'string' && tokenFromQuery.length > 0) {
    return tokenFromQuery;
  }

  // 2) Optional: Authorization Header (future-proof)
  const authHeader = req.headers?.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim();
    if (token.length > 0) {
      return token;
    }
  }

  throw new ForbiddenException('Reset token missing');
}

@Resolver(() => SecurityPayload)
export class SecurityResolver {
  constructor(private readonly securityService: SecurityService) {}

  /* ------------------------------------------------------
   * Add Security Question
   * ---------------------------------------------------- */
  @Mutation(() => SecurityPayload)
  @UseGuards(CookieAuthGuard)
  async addSecurityQuestion(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('input') input: AddSecurityQuestionInput,
  ): Promise<SecurityPayload> {
    const userId = currentUser.id;

    return this.securityService.addQuestion({
      userId,
      question: input.question,
      answer: input.answer,
    });
  }

  /* ------------------------------------------------------
   * Query: Get 3 Security Questions for Verification
   * ---------------------------------------------------- */
  @Query(() => [SecurityQuestionPayload])
  async getSecurityVerificationQuestions(
    @Context() ctx: any,
  ): Promise<SecurityQuestionPayload[]> {
    const token = extractResetToken(ctx);
    const email = await this.securityService.resolveUserIdFromResetToken(token);

    return this.securityService.getVerificationQuestions(email);
  }

  /* ------------------------------------------------------
   * Mutation: Verify 3 Questions & Reset Password
   * ---------------------------------------------------- */
  @Mutation(() => VerifySecurityQuestionPayload)
  async verifySecurityQuestionsAndResetPassword(
    @Context() ctx: any,
    @Args({ name: 'answers', type: () => [VerifySecurityQuestionInput] })
    answers: VerifySecurityQuestionInput[],
  ): Promise<VerifySecurityQuestionPayload> {
    const token = extractResetToken(ctx);
    return this.securityService.verifyQuestionsAndResetPassword({
      token,
      answers,
    });
  }

  // Versendet Keycloak Execute-Actions-E-Mail (UPDATE_PASSWORD)
  @Mutation(() => Boolean)
  async sendPasswordResetEmail(
    @Args('input') input: SendPasswordResetInput,
    @Context() ctx: any,
  ): Promise<boolean> {
    const ipAddress = extractClientIp(ctx);

    await this.securityService.sendPasswordResetNotification({
      email: input.email,
      resetUrl: input.resetUrl,
      ipAddress,
    });

    return true;
  }
}
