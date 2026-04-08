// import { users } from "@/server/modules/user/entities";
// import { index, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

// export const customers = pgTable("customers", {
//     id: uuid("id").primaryKey().defaultRandom(),
//     userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
//     createdAt: timestamp("created_at").notNull().defaultNow(),
//     updatedAt: timestamp("updated_at").notNull().defaultNow(),
// }, table => ({
//     userId: index("customers_idx_user_id").on(table.userId),
//     createdAt: index("customers_idx_created_at").on(table.createdAt),
//     updatedAt: index("customers_idx_updated_at").on(table.updatedAt),
// }));