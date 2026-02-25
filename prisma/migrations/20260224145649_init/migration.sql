-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CUSTOMER', 'EMPLOYEE', 'GUEST');

-- CreateEnum
CREATE TYPE "PhoneNumberType" AS ENUM ('WHATSAPP', 'MOBILE', 'PRIVATE', 'WORK', 'HOME', 'OTHER');

-- CreateEnum
CREATE TYPE "PersonStatus" AS ENUM ('ACTIVE', 'DISABLED', 'DELETED', 'INACTIVE', 'BLOCKED', 'CLOSED');

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

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "ticket_ids" TEXT[],
    "invitation_ids" TEXT[],
    "user_type" "UserType" NOT NULL,
    "status" "PersonStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "phone_number" (
    "id" TEXT NOT NULL,
    "info_id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "type" "PhoneNumberType" NOT NULL,
    "label" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phone_number_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "password_reset" (
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
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE INDEX "user_status_idx" ON "user"("status");

-- CreateIndex
CREATE INDEX "user_user_type_idx" ON "user"("user_type");

-- CreateIndex
CREATE INDEX "user_status_user_type_idx" ON "user"("status", "user_type");

-- CreateIndex
CREATE INDEX "user_created_at_idx" ON "user"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "personal_info_email_key" ON "personal_info"("email");

-- CreateIndex
CREATE INDEX "personal_info_last_name_idx" ON "personal_info"("last_name");

-- CreateIndex
CREATE INDEX "personal_info_first_name_last_name_idx" ON "personal_info"("first_name", "last_name");

-- CreateIndex
CREATE INDEX "address_user_id_idx" ON "address"("user_id");

-- CreateIndex
CREATE INDEX "address_country_city_idx" ON "address"("country", "city");

-- CreateIndex
CREATE INDEX "address_zip_code_idx" ON "address"("zip_code");

-- CreateIndex
CREATE INDEX "customer_tier_level_idx" ON "customer"("tier_level");

-- CreateIndex
CREATE INDEX "customer_customer_state_idx" ON "customer"("customer_state");

-- CreateIndex
CREATE INDEX "customer_subscribed_idx" ON "customer"("subscribed");

-- CreateIndex
CREATE INDEX "customer_tier_level_customer_state_idx" ON "customer"("tier_level", "customer_state");

-- CreateIndex
CREATE INDEX "employee_department_idx" ON "employee"("department");

-- CreateIndex
CREATE INDEX "employee_role_idx" ON "employee"("role");

-- CreateIndex
CREATE INDEX "employee_is_external_idx" ON "employee"("is_external");

-- CreateIndex
CREATE INDEX "phone_number_info_id_idx" ON "phone_number"("info_id");

-- CreateIndex
CREATE INDEX "phone_number_info_id_is_primary_idx" ON "phone_number"("info_id", "is_primary");

-- CreateIndex
CREATE INDEX "security_question_user_id_idx" ON "security_question"("user_id");

-- CreateIndex
CREATE INDEX "security_question_locked_at_idx" ON "security_question"("locked_at");

-- CreateIndex
CREATE UNIQUE INDEX "security_question_user_id_question_key" ON "security_question"("user_id", "question");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_token_key" ON "password_reset"("token");

-- CreateIndex
CREATE INDEX "password_reset_token_idx" ON "password_reset"("token");

-- CreateIndex
CREATE INDEX "contact_user_id_idx" ON "contact"("user_id");

-- CreateIndex
CREATE INDEX "contact_emergency_idx" ON "contact"("emergency");

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
