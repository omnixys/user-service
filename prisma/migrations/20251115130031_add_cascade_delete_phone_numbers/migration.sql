-- DropForeignKey
ALTER TABLE "phone_number" DROP CONSTRAINT "phone_number_user_id_fkey";

-- AddForeignKey
ALTER TABLE "phone_number" ADD CONSTRAINT "phone_number_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
