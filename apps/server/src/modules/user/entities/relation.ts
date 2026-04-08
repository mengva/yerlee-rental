import { relations } from "drizzle-orm";
import { userBackgroundImages, userImages, users } from "./user";

export const userRelations = relations(users, ({ one }) => ({
    image: one(userImages, {
        fields: [users.id],
        references: [userImages.userId],
    }),
    backgroundImage: one(userImages, {
        fields: [users.id],
        references: [userImages.userId],
    }),
}));

export const userImageRelations = relations(userImages, ({ one }) => ({
    user: one(users, {
        fields: [userImages.userId],
        references: [users.id],
    })
}));

export const userBackgroundImageRelations = relations(userBackgroundImages, ({ one }) => ({
    user: one(users, {
        fields: [userBackgroundImages.userId],
        references: [users.id],
    })
}));