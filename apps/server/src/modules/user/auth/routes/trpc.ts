import { zodValidationSendOTPToEmail, zodValidationServerResetPassword, zodValidationSignIn, zodValidationSignInOTP } from "@/server/packages/validations/auth";
import { publicProcedure, router } from "@/server/server/trpc/procedures";
import { tRPCUserAuthServices } from "../services/mutation";

export const tRPCUserAuthRouter = router({
    signIn: publicProcedure.input(zodValidationSignIn).mutation(async ({ input, ctx }) => {
        ctx.bodyInfo = { ...input }; // Store the original input for logging or debugging purposes
        return await tRPCUserAuthServices.signIn(ctx);
    }),
    sendCodeSignInOTP: publicProcedure.input(zodValidationSendOTPToEmail).mutation(async ({ input, ctx }) => {
        ctx.bodyInfo = { ...input }; // Store the original input for logging or debugging purposes
        return await tRPCUserAuthServices.sendCodeSignInOTP(ctx);
    }),
    resendCodeSignInOTP: publicProcedure.mutation(async ({ ctx }) => {
        return await tRPCUserAuthServices.resendCodeSignInOTP(ctx);
    }),
    signInOTP: publicProcedure.input(zodValidationSignInOTP).mutation(async ({ input, ctx }) => {
        ctx.bodyInfo = { ...input }; // Store the original input for logging or debugging purposes
        return await tRPCUserAuthServices.signInOTP(ctx);
    }),
    signOut: publicProcedure.mutation(async ({ ctx }) => {
        return await tRPCUserAuthServices.signOut(ctx);
    }),
    sendCodeResetPassword: publicProcedure.input(zodValidationSendOTPToEmail).mutation(async ({ input, ctx }) => {
        ctx.bodyInfo = { ...input }; // Store the original input for logging or debugging purposes
        return await tRPCUserAuthServices.sendCodeResetPassword(ctx);
    }),
    resendCode: publicProcedure.mutation(async ({ ctx }) => {
        return await tRPCUserAuthServices.resendCode(ctx);
    }),
    resetPassword: publicProcedure.input(zodValidationServerResetPassword).mutation(async ({ input, ctx }) => {
        ctx.bodyInfo = { ...input }; // Store the original input for logging or debugging purposes
        return await tRPCUserAuthServices.resetPassword(ctx);
    })
});