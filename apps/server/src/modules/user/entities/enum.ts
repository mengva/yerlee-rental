import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role_enum", ["Staff", "Customer", "Owner"]);
export const imageTypeEnum = pgEnum("image_type_enum", ["Profile", "Cover", "Room", "Other"]);