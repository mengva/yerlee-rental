
import { tRPCUserAuthRouter } from "@/server/modules/user/auth/routes/trpc";
import { router } from "./procedures";

export const appRouter = router({
    app: router({
        user: router({
            auth: tRPCUserAuthRouter,
            admin: router({
                dashboard: router({}),
                manage: router({
                    customer: router({}),
                    staff: router({}),
                    owner: router({}),
                    room: router({}),
                    roomType: router({}),
                }),
            })
        })
    })
});

export type AppRouter = typeof appRouter;