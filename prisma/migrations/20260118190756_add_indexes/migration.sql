-- CreateIndex
CREATE INDEX "address_user_id_idx" ON "user"."address"("user_id");

-- CreateIndex
CREATE INDEX "address_country_city_idx" ON "user"."address"("country", "city");

-- CreateIndex
CREATE INDEX "address_zip_code_idx" ON "user"."address"("zip_code");

-- CreateIndex
CREATE INDEX "contact_user_id_idx" ON "user"."contact"("user_id");

-- CreateIndex
CREATE INDEX "contact_emergency_idx" ON "user"."contact"("emergency");

-- CreateIndex
CREATE INDEX "customer_tier_level_idx" ON "user"."customer"("tier_level");

-- CreateIndex
CREATE INDEX "customer_customer_state_idx" ON "user"."customer"("customer_state");

-- CreateIndex
CREATE INDEX "customer_subscribed_idx" ON "user"."customer"("subscribed");

-- CreateIndex
CREATE INDEX "customer_tier_level_customer_state_idx" ON "user"."customer"("tier_level", "customer_state");

-- CreateIndex
CREATE INDEX "employee_department_idx" ON "user"."employee"("department");

-- CreateIndex
CREATE INDEX "employee_role_idx" ON "user"."employee"("role");

-- CreateIndex
CREATE INDEX "employee_is_external_idx" ON "user"."employee"("is_external");

-- CreateIndex
CREATE INDEX "personal_info_last_name_idx" ON "user"."personal_info"("last_name");

-- CreateIndex
CREATE INDEX "personal_info_first_name_last_name_idx" ON "user"."personal_info"("first_name", "last_name");

-- CreateIndex
CREATE INDEX "phone_number_info_id_idx" ON "user"."phone_number"("info_id");

-- CreateIndex
CREATE INDEX "phone_number_info_id_is_primary_idx" ON "user"."phone_number"("info_id", "is_primary");

-- CreateIndex
CREATE INDEX "security_question_user_id_idx" ON "user"."security_question"("user_id");

-- CreateIndex
CREATE INDEX "security_question_locked_at_idx" ON "user"."security_question"("locked_at");

-- CreateIndex
CREATE INDEX "user_status_idx" ON "user"."user"("status");

-- CreateIndex
CREATE INDEX "user_user_type_idx" ON "user"."user"("user_type");

-- CreateIndex
CREATE INDEX "user_status_user_type_idx" ON "user"."user"("status", "user_type");

-- CreateIndex
CREATE INDEX "user_created_at_idx" ON "user"."user"("created_at");
