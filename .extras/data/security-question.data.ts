import { PrismaClient } from '../../src/prisma/generated/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import argon2 from 'argon2';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const QUESTIONS_PER_USER = 5;

/**
 * Shuffles array deterministically per execution
 */
function shuffle<T>(array: readonly T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

/**
 * SECURITY QUESTION POOL (30 QUESTIONS)
 * -------------------------------------
 * These are the canonical questions used across the system.
 * Answers are only used during seeding and are never stored in plain text.
 */

export const SECURITY_QUESTION_POOL = [
  { question: 'Wie lautet der Vorname deiner Mutter?', answer: 'Grace' },
  { question: 'Wie lautet der Vorname deines Vaters?', answer: 'Michael' },
  { question: 'In welcher Stadt wurdest du geboren?', answer: 'Accra' },
  { question: 'In welchem Land wurdest du geboren?', answer: 'Ghana' },
  { question: 'Wie hieß dein erstes Haustier?', answer: 'Max' },
  {
    question: 'Wie lautet der Name deiner Grundschule?',
    answer: 'Morning Star',
  },
  {
    question: 'Wie lautet der Name deiner ersten Schule?',
    answer: 'Morning Star',
  },
  { question: 'Was war dein erstes Auto?', answer: 'Toyota Corolla' },
  {
    question: 'Wie hieß dein bester Freund in der Kindheit?',
    answer: 'Daniel',
  },
  { question: 'Wie hieß deine erste Lehrerin?', answer: 'Mrs Johnson' },
  {
    question: 'In welcher Straße bist du aufgewachsen?',
    answer: 'Main Street',
  },
  {
    question: 'Wie lautet dein Lieblingsessen aus der Kindheit?',
    answer: 'Jollof Rice',
  },
  { question: 'Wie lautet dein Lieblingssport?', answer: 'Football' },
  { question: 'Wie hieß dein erstes Smartphone?', answer: 'iPhone 4' },
  { question: 'Wie lautet dein Lieblingsfilm?', answer: 'Inception' },
  { question: 'Wie lautet dein Lieblingsbuch?', answer: '1984' },
  {
    question: 'Wie heißt dein Lieblingsschauspieler?',
    answer: 'Leonardo DiCaprio',
  },
  { question: 'Wie heißt dein Lieblingssänger?', answer: 'Drake' },
  { question: 'Wie lautet dein Lieblingsurlaubsziel?', answer: 'Barcelona' },
  { question: 'Wie heißt dein Lieblingslehrer?', answer: 'Mr Smith' },
  { question: 'Wie hieß dein erstes Computerspiel?', answer: 'Need for Speed' },
  { question: 'Wie lautet dein Lieblingsobst?', answer: 'Mango' },
  { question: 'Wie lautet dein Lieblingsgetränk?', answer: 'Cola' },
  { question: 'Wie lautet dein Lieblingsrestaurant?', answer: 'KFC' },
  { question: 'Wie lautet dein Spitzname?', answer: 'Cal' },
  { question: 'Wie lautet dein Lieblingsfach?', answer: 'Mathematics' },
  { question: 'Wie lautet dein Lieblingslied?', answer: 'Gods Plan' },
  { question: 'Wie hieß dein erstes Fahrrad?', answer: 'BMX' },
  { question: 'Wie lautet dein Lieblingsfarbe?', answer: 'Blue' },
  { question: 'Wie lautet dein Traumjob?', answer: 'Software Engineer' },
] as const;

/**
 * SECURITY QUESTIONS SEED
 * ------------------------------------------------------------
 * - Uses argon2id
 * - Deterministic questions
 * - Idempotent via upsert
 * ------------------------------------------------------------
 */
export async function seedSecurityQuestionsForAllUsers() {
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  for (const user of users) {
    const selected = shuffle(SECURITY_QUESTION_POOL).slice(
      0,
      QUESTIONS_PER_USER,
    );

    for (const q of selected) {
      const normalized = q.answer.trim().toLowerCase();

      const answerHash = await argon2.hash(normalized, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, // 64 MB
        timeCost: 3,
        parallelism: 1,
      });

      for (const q of selected) {
        const normalized = q.answer.trim().toLowerCase();

        const answerHash = await argon2.hash(normalized, {
          type: argon2.argon2id,
          memoryCost: 2 ** 16, // 64 MB
          timeCost: 3,
          parallelism: 1,
        });

        await prisma.securityQuestion.upsert({
          where: {
            userId_question: {
              userId: user.id,
              question: q.question,
            },
          },
          update: {
            answerHash,
            attempts: 0,
            lockedAt: null,
          },
          create: {
            userId: user.id,
            question: q.question,
            answerHash,
            attempts: 0,
          },
        });
      }
    }
  }
  console.log('✔ Security questions seeded (5 random per user)');
}
