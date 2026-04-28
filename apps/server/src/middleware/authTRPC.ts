import { t } from "../server/trpc/procedures";
import { TRPCError } from "@trpc/server";
import db from "../config/db";
import { ErrorHandler } from "@/server/packages/utils/handleError";
import { Helper } from "../utils";
import { tokenName } from "@/server/packages/utils";

export class tRPCUserAuthMiddleware {
    public static isUserAuth = t.middleware(async ({ ctx, next }) => {
        // Determine the token name based on the user's role (staff in this case)

        // 1. Get token from cookies
        const token = ctx.getCookie(tokenName);
        const currentUA = ctx.userAgent; // Get current User-Agent from Request Headers

        if (!token) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Authentication token is missing",
            });
        }

        try {
            // 2. Verify JWT and extract payload
            const payload = await Helper.verifyTokenSecret(token);

            // 3. Security Check: Compare Token's User-Agent with Current Request's User-Agent
            // This prevents Session Hijacking from different browsers/devices
            if (payload.userAgent !== currentUA) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid session: Device mismatch detected. Please login again.",
                });
            }

            // 4. Double Check with Database (Optional but recommended for Role/Status)
            const user = await db.query.users.findFirst({
                where: (users, { eq, and }) => and(
                    eq(users.id, payload.userId),
                    eq(users.isActive, true),
                ),
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User account no longer exists or is inactive",
                });
            }

            // 5. Pass user data to the next procedure context
            return next({
                ctx: {
                    ...ctx,
                    userInfo: {
                        id: payload.userId,
                        role: payload.role,
                    },
                    userAgent: payload.userAgent, // Pass the user agent to the context for future checks
                },
            });

        } catch (error) {
            throw ErrorHandler.getErrorMessage(error);
        }
    });

}
