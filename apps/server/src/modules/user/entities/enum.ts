import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role_enum", ["staff", "customer", "owner"]);
export const imageTypeEnum = pgEnum("image_type_enum", ["profile", "cover", "court", "other"]);