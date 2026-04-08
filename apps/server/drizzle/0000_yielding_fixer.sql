CREATE TYPE "public"."user_role_enum" AS ENUM('staff', 'customer', 'owner');--> statement-breakpoint
CREATE TABLE "user_background_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"url" text DEFAULT '',
	"public_id" text DEFAULT '',
	"width" text DEFAULT '',
	"height" text DEFAULT '',
	"size" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"url" text DEFAULT '',
	"public_id" text DEFAULT '',
	"width" text DEFAULT '',
	"height" text DEFAULT '',
	"size" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"gender" varchar(50) NOT NULL,
	"birth_day" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"role" varchar(50) DEFAULT 'customer' NOT NULL,
	"user_agent" varchar(255),
	"ip_address" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "user_background_images" ADD CONSTRAINT "user_background_images_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_images" ADD CONSTRAINT "user_images_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_background_images_idx_user_id" ON "user_background_images" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_background_images_idx_public_id" ON "user_background_images" USING btree ("public_id");--> statement-breakpoint
CREATE INDEX "user_background_images_idx_created_at" ON "user_background_images" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "user_background_images_idx_updated_at" ON "user_background_images" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "user_images_idx_user_id" ON "user_images" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_images_idx_public_id" ON "user_images" USING btree ("public_id");--> statement-breakpoint
CREATE INDEX "user_profiles_idx_created_at" ON "user_images" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "user_profiles_idx_updated_at" ON "user_images" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "users_idx_first_name" ON "users" USING btree ("first_name");--> statement-breakpoint
CREATE INDEX "users_idx_last_name" ON "users" USING btree ("last_name");--> statement-breakpoint
CREATE INDEX "users_idx_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_idx_phone_number" ON "users" USING btree ("phone_number");--> statement-breakpoint
CREATE INDEX "users_idx_password" ON "users" USING btree ("password");--> statement-breakpoint
CREATE INDEX "users_idx_gender" ON "users" USING btree ("gender");--> statement-breakpoint
CREATE INDEX "users_idx_birth_day" ON "users" USING btree ("birth_day");--> statement-breakpoint
CREATE INDEX "users_idx_is_active" ON "users" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "users_idx_role" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "users_idx_user_agent" ON "users" USING btree ("user_agent");--> statement-breakpoint
CREATE INDEX "users_idx_ip_address" ON "users" USING btree ("ip_address");--> statement-breakpoint
CREATE INDEX "users_idx_created_at" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_idx_updated_at" ON "users" USING btree ("updated_at");