
import { boolean, index, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { imageTypeEnum, userRoleEnum } from "./enum";


// ==================== 1. Users (Base Table) ====================
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    firstName: varchar("first_name", { length: 150 }).notNull(),
    lastName: varchar("last_name", { length: 150 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }).unique(),
    email: varchar("email", { length: 100 }).unique(),
    gender: varchar("gender", { length: 20 }),
    birthDay: varchar("birth_day", { length: 20 }),
    role: userRoleEnum("role").notNull().default("Customer"),
    isActive: boolean("is_active").default(true).notNull(),
    userAgent: varchar("user_agent", { length: 255 }),
    ipAddress: varchar("ip_address", { length: 50 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
    index("users_phone_idx").on(table.phoneNumber),
    index("users_email_idx").on(table.email),
    index("users_role_idx").on(table.role),
]);

// ==================== 2. User Credentials ====================
export const userCredentials = pgTable("user_credentials", {
    userId: uuid("user_id").primaryKey().notNull().unique().references(() => users.id, { onDelete: "cascade" }),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
});

// ==================== 3. User Images ====================
export const images = pgTable("images", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    imageKey: text("image_key").notNull(),
    width: integer("width"),
    height: integer("height"),
    size: integer("size"),
    type: imageTypeEnum("type").default("Profile").notNull(),
    isPrimary: boolean("is_primary").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
    index("images_type_idx").on(table.type),
    index("images_user_id_idx").on(table.userId),
    index("images_is_primary_idx").on(table.isPrimary),
]);