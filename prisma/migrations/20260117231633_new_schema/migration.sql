/*
  Warnings:

  - You are about to drop the column `user_id` on the `phone_number` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `security` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `info_id` to the `phone_number` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `phone_number` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_type` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CUSTOMER', 'EMPLOYEE', 'GUEST');

-- CreateEnum
CREATE TYPE "PersonStatus" AS ENUM ('ACTIVE', 'DISABLED', 'DELETED');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('MALE', 'FEMALE', 'DIVERSE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('FAMILY', 'FRIEND', 'PARTNER', 'COLLEAGUE', 'OTHER', 'BUSINESS_PARTNER', 'RELATIVE', 'PARENT', 'SIBLING', 'CHILD', 'COUSIN');

-- CreateEnum
CREATE TYPE "MaritalStatusType" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED', 'PENDING', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "InterestType" AS ENUM ('SPORTS', 'MUSIC', 'TRAVEL', 'TECHNOLOGY', 'OTHER', 'INVESTMENTS', 'SAVING_AND_FINANCE', 'CREDIT_AND_DEBT', 'BANK_PRODUCTS_AND_SERVICES', 'FINANCIAL_EDUCATION_AND_COUNSELING', 'REAL_ESTATE', 'INSURANCE', 'SUSTAINABLE_FINANCE', 'TECHNOLOGY_AND_INNOVATION');

-- CreateEnum
CREATE TYPE "ContactOptionsType" AS ENUM ('EMAIL', 'PHONE', 'SMS', 'WHATSAPP', 'LETTER');

-- DropForeignKey
ALTER TABLE "phone_number" DROP CONSTRAINT "phone_number_user_id_fkey";

-- DropForeignKey
ALTER TABLE "security" DROP CONSTRAINT "security_user_id_fkey";

-- DropIndex
DROP INDEX "user_email_key";

-- DropIndex
DROP INDEX "user_username_email_idx";

-- AlterTable
ALTER TABLE "phone_number" DROP COLUMN "user_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "info_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "email",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
ADD COLUMN     "status" "PersonStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "user_type" "UserType" NOT NULL;

-- DropTable
DROP TABLE "security";

-- CreateTable
CREATE TABLE "personal_info" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3),
    "gender" "GenderType",
    "marital_status" "MaritalStatusType",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "house_number" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "additional_info" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" TEXT NOT NULL,
    "tier_level" INTEGER NOT NULL,
    "subscribed" BOOLEAN NOT NULL DEFAULT false,
    "maritalStatus" "MaritalStatusType",
    "customer_state" "StatusType" NOT NULL,
    "interests" "InterestType"[],
    "contact_options" "ContactOptionsType"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "id" TEXT NOT NULL,
    "department" TEXT,
    "position" TEXT,
    "role" TEXT,
    "salary" DOUBLE PRECISION,
    "hire_date" TIMESTAMP(3),
    "is_external" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer_hash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "security_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "relationship" "RelationshipType" NOT NULL,
    "withdrawalLimit" INTEGER NOT NULL DEFAULT 0,
    "emergency" BOOLEAN NOT NULL DEFAULT false,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "personal_info_email_key" ON "personal_info"("email");

-- CreateIndex
CREATE UNIQUE INDEX "security_question_user_id_question_key" ON "security_question"("user_id", "question");

-- CreateIndex
CREATE UNIQUE INDEX "contact_user_id_contact_id_key" ON "contact"("user_id", "contact_id");

-- AddForeignKey
ALTER TABLE "personal_info" ADD CONSTRAINT "personal_info_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_number" ADD CONSTRAINT "phone_number_info_id_fkey" FOREIGN KEY ("info_id") REFERENCES "personal_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_question" ADD CONSTRAINT "security_question_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
