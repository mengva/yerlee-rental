import { MyContext } from "@/server/server/trpc/context";
import { tRPCAuthServices } from "../../utils";
import { HandlerSuccess, Helper } from "@/server/utils";
import { ErrorHandler, tokenName } from "@/server/packages/utils";
import { ServerResponseDto, UserRoleDto } from "@/server/packages/types";

export class tRPCUserAuthServices {
    public static async signIn(ctx: MyContext): Promise<ServerResponseDto | void> {
        try {
            return await tRPCAuthServices.signIn(ctx);
        } catch (error) {
            // Log the error and return standardized error message
            throw ErrorHandler.getErrorMessage(error);
        }
    }

    public static async sendCodeSignInOTP(ctx: MyContext): Promise<ServerResponseDto | void> {
        try {
            return await tRPCAuthServices.sendCodeSignInOTP(ctx);
        } catch (error) {
            throw ErrorHandler.getErrorMessage(error);
        }
    }

    public static async resendCodeSignInOTP(ctx: MyContext): Promise<ServerResponseDto | void> {
        try {
            return await tRPCAuthServices.resendCodeSignInOTP(ctx);
        } catch (error) {
            throw ErrorHandler.getErrorMessage(error);
        }
    }

    // This method is for users who want to sign in using OTP sent to their email without password
    public static async signInOTP(ctx: MyContext): Promise<ServerResponseDto | void> {
        try {
            return await tRPCAuthServices.signInOTP(ctx);
        } catch (error) {
            throw ErrorHandler.getErrorMessage(error);
        }
    }

    // This method is for users who want to sign out and clear their session
    public static async signOut(ctx: MyContext): Promise<ServerResponseDto | void> {
        try {

            const cookieName = ctx.getCookie(tokenName);

            ctx.deleteCookie(cookieName); // Clear cookie from the client side as well

            ctx.userInfo = {
                userId: '' as string,
                role: "" as UserRoleDto,
            }; // Clear user info from context

            return HandlerSuccess.success("Logged out successfully");

        } catch (error) {
            throw ErrorHandler.getErrorMessage(error);
        }
    }

    // This method is for users who want to sign in using OTP sent to their email without password
    public static async sendCodeResetPassword(ctx: MyContext): Promise<ServerResponseDto | void> {
        try {
            return await tRPCAuthServices.sendCodeResetPassword(ctx);
        } catch (error) {
            throw ErrorHandler.getErrorMessage(error);
        }
    }

    // This method is for users who forgot their password and want to reset it using OTP sent to their email
    public static async resendCode(ctx: MyContext): Promise<ServerResponseDto | void> {
        try {
            return await tRPCAuthServices.resendCode(ctx);
        } catch (error) {
            throw ErrorHandler.getErrorMessage(error);
        }
    }

    public static async resetPassword(ctx: MyContext): Promise<ServerResponseDto | void> {
        try {
            return await tRPCAuthServices.resetPassword(ctx);
        } catch (error) {
            throw ErrorHandler.getErrorMessage(error);
        }
    }
}