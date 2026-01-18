-- CreateEnum
CREATE TYPE "user"."UserType" AS ENUM ('CUSTOMER', 'EMPLOYEE', 'GUEST');

-- CreateEnum
CREATE TYPE "user"."PhoneNumberType" AS ENUM ('WHATSAPP', 'MOBILE', 'PRIVATE', 'WORK', 'HOME', 'OTHER');

-- CreateEnum
CREATE TYPE "user"."PersonStatus" AS ENUM ('ACTIVE', 'DISABLED', 'DELETED', 'INACTIVE', 'BLOCKED', 'CLOSED');

-- CreateEnum
CREATE TYPE "user"."GenderType" AS ENUM ('MALE', 'FEMALE', 'DIVERSE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "user"."RelationshipType" AS ENUM ('FAMILY', 'FRIEND', 'PARTNER', 'COLLEAGUE', 'OTHER', 'BUSINESS_PARTNER', 'RELATIVE', 'PARENT', 'SIBLING', 'CHILD', 'COUSIN');

-- CreateEnum
CREATE TYPE "user"."MaritalStatusType" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateEnum
CREATE TYPE "user"."StatusType" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED', 'PENDING', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "user"."InterestType" AS ENUM ('SPORTS', 'MUSIC', 'TRAVEL', 'TECHNOLOGY', 'OTHER', 'INVESTMENTS', 'SAVING_AND_FINANCE', 'CREDIT_AND_DEBT', 'BANK_PRODUCTS_AND_SERVICES', 'FINANCIAL_EDUCATION_AND_COUNSELING', 'REAL_ESTATE', 'INSURANCE', 'SUSTAINABLE_FINANCE', 'TECHNOLOGY_AND_INNOVATION');

-- CreateEnum
CREATE TYPE "user"."ContactOptionsType" AS ENUM ('EMAIL', 'PHONE', 'SMS', 'WHATSAPP', 'LETTER');

-- CreateTable
CREATE TABLE "user"."user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "ticket_ids" TEXT[],
    "invitation_ids" TEXT[],
    "user_type" "user"."UserType" NOT NULL,
    "status" "user"."PersonStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."personal_info" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3),
    "gender" "user"."GenderType",
    "marital_status" "user"."MaritalStatusType",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."address" (
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
CREATE TABLE "user"."customer" (
    "id" TEXT NOT NULL,
    "tier_level" INTEGER NOT NULL,
    "subscribed" BOOLEAN NOT NULL DEFAULT false,
    "maritalStatus" "user"."MaritalStatusType",
    "customer_state" "user"."StatusType" NOT NULL,
    "interests" "user"."InterestType"[],
    "contact_options" "user"."ContactOptionsType"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."employee" (
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
CREATE TABLE "user"."phone_number" (
    "id" TEXT NOT NULL,
    "info_id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "type" "user"."PhoneNumberType" NOT NULL,
    "label" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phone_number_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."security_question" (
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
CREATE TABLE "user"."password_reset" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."contact" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "relationship" "user"."RelationshipType" NOT NULL,
    "withdrawalLimit" INTEGER NOT NULL DEFAULT 0,
    "emergency" BOOLEAN NOT NULL DEFAULT false,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"."user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "personal_info_email_key" ON "user"."personal_info"("email");

-- CreateIndex
CREATE UNIQUE INDEX "security_question_user_id_question_key" ON "user"."security_question"("user_id", "question");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_token_key" ON "user"."password_reset"("token");

-- CreateIndex
CREATE INDEX "password_reset_token_idx" ON "user"."password_reset"("token");

-- CreateIndex
CREATE UNIQUE INDEX "contact_user_id_contact_id_key" ON "user"."contact"("user_id", "contact_id");

-- AddForeignKey
ALTER TABLE "user"."personal_info" ADD CONSTRAINT "personal_info_id_fkey" FOREIGN KEY ("id") REFERENCES "user"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."address" ADD CONSTRAINT "address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."customer" ADD CONSTRAINT "customer_id_fkey" FOREIGN KEY ("id") REFERENCES "user"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."employee" ADD CONSTRAINT "employee_id_fkey" FOREIGN KEY ("id") REFERENCES "user"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."phone_number" ADD CONSTRAINT "phone_number_info_id_fkey" FOREIGN KEY ("info_id") REFERENCES "user"."personal_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."security_question" ADD CONSTRAINT "security_question_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."contact" ADD CONSTRAINT "contact_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
