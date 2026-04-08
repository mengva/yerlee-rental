// import { userRoleEnum, users } from "@/server/modules/user/entities";
// import { boolean, index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// export const staffs = pgTable("staffs", {
//     id: uuid("id").primaryKey().defaultRandom(),
//     userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
//     createdAt: timestamp("created_at").notNull().defaultNow(),
//     updatedAt: timestamp("updated_at").notNull().defaultNow(),
// }, table => ({
//     userId: index("staffs_idx_user_id").on(table.userId),
//     createdAt: index("staffs_idx_created_at").on(table.createdAt),
//     updatedAt: index("staffs_idx_updated_at").on(table.updatedAt),
// }));