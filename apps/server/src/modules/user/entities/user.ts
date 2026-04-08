
import { boolean, index, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { userImageTypeEnum } from "./enum";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(),
    gender: varchar("gender", { length: 50 }).notNull(),
    birthDay: varchar("birth_day", { length: 10 }).notNull(), // Assuming date format is YYYY-MM-DD 
    isActive: boolean("is_active").notNull().default(true),
    phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
    role: varchar("role", { length: 50 }).default("customer").notNull(),
    userAgent: varchar("user_agent", { length: 255 }),
    ipAddress: varchar("ip_address", { length: 50 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, table => ({
    firstName: index("users_idx_first_name").on(table.firstName),
    lastName: index("users_idx_last_name").on(table.lastName),
    email: index("users_idx_email").on(table.email),
    phoneNumber: index("users_idx_phone_number").on(table.phoneNumber),
    password: index("users_idx_password").on(table.password),
    gender: index("users_idx_gender").on(table.gender),
    birthDay: index("users_idx_birth_day").on(table.birthDay),
    isActive: index("users_idx_is_active").on(table.isActive),
    role: index("users_idx_role").on(table.role),
    userAgent: index("users_idx_user_agent").on(table.userAgent),
    ipAddress: index("users_idx_ip_address").on(table.ipAddress),
    createdAt: index("users_idx_created_at").on(table.createdAt),
    updatedAt: index("users_idx_updated_at").on(table.updatedAt),
}));

export const userImages = pgTable("user_images", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    url: text("url").default(""),
    imageKey: text("image_key").default(""),
    width: text("width").default(""),
    height: text("height").default(""),
    size: integer("size").default(0),
    type: userImageTypeEnum("type").default("image/jpeg").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, table => ({
    userId: index("user_images_idx_user_id").on(table.userId),
    imageKey: index("user_images_idx_image_key").on(table.imageKey),
    createdAt: index("user_profiles_idx_created_at").on(table.createdAt),
    updatedAt: index("user_profiles_idx_updated_at").on(table.updatedAt),
}));

export const userBackgroundImages = pgTable("user_background_images", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    url: text("url").default(""),
    imageKey: text("image_key").default(""),
    width: text("width").default(""),
    height: text("height").default(""),
    size: integer("size").default(0),
    type: userImageTypeEnum("type").default("image/jpeg").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, table => ({
    userId: index("user_background_images_idx_user_id").on(table.userId),
    imageKey: index("user_background_images_idx_image_key").on(table.imageKey),
    createdAt: index("user_background_images_idx_created_at").on(table.createdAt),
    updatedAt: index("user_background_images_idx_updated_at").on(table.updatedAt),
}));

// export const userPersonalInfos = pgTable("user_personal_infos", {
//     id: uuid("id").primaryKey().defaultRandom(),
//     userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
//     firstName: varchar("first_name", { length: 255 }).notNull(),
//     lastName: varchar("last_name", { length: 255 }).notNull(),
//     email: varchar("email", { length: 255 }).notNull().unique(),
//     password: text("password").notNull(),
//     gender: varchar("gender", { length: 50 }).notNull(),
//     birthDay: timestamp("birth_day").notNull(),
//     phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
//     createdAt: timestamp("created_at").notNull().defaultNow(),
//     updatedAt: timestamp("updated_at").notNull().defaultNow(),
// }, table => ({
//     firstName: index("user_personal_infos_idx_first_name").on(table.firstName),
//     lastName: index("user_personal_infos_idx_last_name").on(table.lastName),
//     gender: index("user_personal_infos_idx_gender").on(table.gender),
//     email: index("user_personal_infos_idx_email").on(table.email),
//     password: index("user_personal_infos_idx_password").on(table.password),
//     phoneNumber: index("user_personal_infos_idx_phone_number").on(table.phoneNumber),
//     createdAt: index("user_personal_infos_idx_created_at").on(table.createdAt),
//     updatedAt: index("user_personal_infos_idx_updated_at").on(table.updatedAt),
// }));