-- CreateEnum
CREATE TYPE "PhoneType" AS ENUM ('WHATSAPP', 'PRIVATE', 'WORK', 'OTHER');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ticket_ids" TEXT[],
    "invitation_ids" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_number" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "type" "PhoneType" NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "phone_number_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_username_email_idx" ON "user"("username", "email");

-- AddForeignKey
ALTER TABLE "phone_number" ADD CONSTRAINT "phone_number_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
