CREATE TYPE "public"."user_image_type_enum" AS ENUM('image/jpeg', 'image/png', 'image/jpg', 'image/webp');--> statement-breakpoint
DROP INDEX "user_background_images_idx_public_id";--> statement-breakpoint
DROP INDEX "user_images_idx_public_id";--> statement-breakpoint
ALTER TABLE "user_background_images" ADD COLUMN "image_key" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "user_background_images" ADD COLUMN "type" "user_image_type_enum" DEFAULT 'image/jpeg' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_images" ADD COLUMN "image_key" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "user_images" ADD COLUMN "type" "user_image_type_enum" DEFAULT 'image/jpeg' NOT NULL;--> statement-breakpoint
CREATE INDEX "user_background_images_idx_image_key" ON "user_background_images" USING btree ("image_key");--> statement-breakpoint
CREATE INDEX "user_images_idx_image_key" ON "user_images" USING btree ("image_key");--> statement-breakpoint
ALTER TABLE "user_background_images" DROP COLUMN "public_id";--> statement-breakpoint
ALTER TABLE "user_images" DROP COLUMN "public_id";