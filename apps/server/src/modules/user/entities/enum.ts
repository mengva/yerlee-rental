import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role_enum", ["staff", "customer", "owner"]); 

export const userImageTypeEnum = pgEnum("user_image_type_enum", ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']);