import { TRPCError } from "@trpc/server";
import db from "../config/db";
import { UserRoleDto } from "@/server/packages/types/constants/variables";
import { HandlerSuccess, Helper } from "../utils";
import { Context as HonoContext } from "hono";
import { customerTokenName, ownerTokenName, staffTokenName } from "@/server/packages/utils";
import { getCookie, setCookie } from "hono/cookie";

export class RefreshTokenMiddleware {

    public static async refreshToken(oldToken: string, currentUA: string) {
        try {
            // 1. Verify and get payload
            const payload = await Helper.verifyTokenSecret(oldToken);

            if(payload.userAgent !== currentUA) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Device mismatch detected. Please login again."
                });
            }

            // --- NEW LOGIC: CHECK REMAINING TIME ---
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            const secondsIn7Days = 7 * 24 * 60 * 60; // 604,800 seconds

            // If (Expiration Time - Current Time) > 7 days, 
            // it means the token is still "young" enough. No need to refresh.
            if (payload.exp && (payload.exp - currentTime) > secondsIn7Days) {
                return { action: "NONE", token: oldToken };
            }
            // ---------------------------------------

            // 2. If it's less than 7 days, proceed to validate user and generate new token
            const user = await db.query.users.findFirst({
                where: (users, { eq, and }) => and(
                    eq(users.id, payload.userId),
                    eq(users.isActive, true),
                )
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User account is no longer active or exists"
                });
            }

            const newToken = await Helper.generateToken({
                userId: user.id,
                role: user.role as UserRoleDto,
                userAgent: currentUA,
                exp: Helper.tokenExpriresIn, // Set new expiration time for the refreshed token
            });

            return { action: "REFRESHED", token: newToken, role: user.role };

        } catch (error) {
            return { action: "ERROR", token: oldToken, role: null };
        }
    }

    public static async refreshUserToken(ctx: HonoContext) {
        // ... (Keep the role and cookie logic same as before) ...
        const staffToken = getCookie(ctx, staffTokenName);
        const customerToken = getCookie(ctx, customerTokenName);
        const ownerToken = getCookie(ctx, ownerTokenName);
        const oldToken = staffToken || customerToken || ownerToken;
        const currentUA = ctx.req.header("user-agent") || "";

        if (!oldToken) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "No session found"
            });
        }

        try {

            const result = await this.refreshToken(oldToken, currentUA);

            // Only set a new cookie if the action is "REFRESHED"
            if (result.action === "REFRESHED" && result.role) {
                const cookieName = Helper.getCookieName(result.role as UserRoleDto);
                setCookie(ctx, cookieName, result.token, Helper.cookieOption);
                return HandlerSuccess.success("Token has been extended for another period");
            }

            // If action is "NONE", just return success without updating cookie
            return HandlerSuccess.success("Token is still valid for more than 7 days");

        } catch (error) {
            console.error("Refresh Token Error:", error);
        }
    }
}