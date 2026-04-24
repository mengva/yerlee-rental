CREATE TYPE "public"."image_type_enum" AS ENUM('profile', 'cover', 'court', 'other');--> statement-breakpoint
CREATE TABLE "images" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"image_key" text NOT NULL,
	"width" integer,
	"height" integer,
	"size" integer,
	"type" "image_type_enum" DEFAULT 'profile' NOT NULL,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_credentials" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_credentials_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user_background_images" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_images" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_background_images" CASCADE;--> statement-breakpoint
DROP TABLE "user_images" CASCADE;--> statement-breakpoint
DROP INDEX "users_idx_first_name";--> statement-breakpoint
DROP INDEX "users_idx_last_name";--> statement-breakpoint
DROP INDEX "users_idx_email";--> statement-breakpoint
DROP INDEX "users_idx_phone_number";--> statement-breakpoint
DROP INDEX "users_idx_password";--> statement-breakpoint
DROP INDEX "users_idx_gender";--> statement-breakpoint
DROP INDEX "users_idx_birth_day";--> statement-breakpoint
DROP INDEX "users_idx_is_active";--> statement-breakpoint
DROP INDEX "users_idx_role";--> statement-breakpoint
DROP INDEX "users_idx_user_agent";--> statement-breakpoint
DROP INDEX "users_idx_ip_address";--> statement-breakpoint
DROP INDEX "users_idx_created_at";--> statement-breakpoint
DROP INDEX "users_idx_updated_at";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'customer'::"public"."user_role_enum";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."user_role_enum" USING "role"::"public"."user_role_enum";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "full_name" varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "images_type_idx" ON "images" USING btree ("type");--> statement-breakpoint
CREATE INDEX "images_is_primary_idx" ON "images" USING btree ("is_primary");--> statement-breakpoint
CREATE INDEX "users_phone_idx" ON "users" USING btree ("phone_number");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "first_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "last_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "gender";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "birth_day";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number");--> statement-breakpoint
DROP TYPE "public"."user_image_type_enum";