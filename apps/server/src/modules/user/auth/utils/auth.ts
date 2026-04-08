import { TRPCError } from "@trpc/server";
import { ErrorHandler } from "@/server/packages/utils/handleError";
import { ZodValidationSendOTPToEmail, ZodValidationServerResetPassword, ZodValidationSignIn, ZodValidationSignInOTP } from "@/server/packages/validations";
import { MyContext } from "@/server/server/trpc/context";
import db from "@/server/config/db";
import { eq } from "drizzle-orm";
import { redis } from "@/server/lib/redis";
import { MailServices } from "@/server/lib/mail";
import { UserRoleDto } from "@/server/packages/types";
import { HandlerSuccess, Helper } from "@/server/utils";
import { users } from "../../entities";

interface SignInResponseDto {
    token: string;
    role: UserRoleDto;
}

export class tRPCAuthServices {

    public static async signIn(ctx: MyContext): Promise<SignInResponseDto> {
        try {
            const info: ZodValidationSignIn = ctx.bodyInfo;
            const userAgent = ctx.userAgent || null;

            // 1. Validate if user agent exists
            if (!userAgent) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User agent is required for security verification"
                });
            }

            // 2. Query user by email, role, and active status
            // Removed userAgent from the 'where' clause to allow login from new devices
            const userInfo = await db.query.users.findFirst({
                where: (users, { eq, and }) => and(
                    eq(users.email, info.email),
                    eq(users.isActive, true)
                )
            });

            // 3. Check if user exists
            if (!userInfo) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Invalid credentials or account is inactive"
                });
            }

            // 4. Verify password with bcrypt
            const match = await Helper.bcryptCompare(info.password, userInfo.password);
            if (!match) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid credentials"
                });
            }

            return await db.transaction(async (tx) => {
                // 5. Update the latest userAgent in the database
                // This ensures the DB stays synced with the current device
                await tx.update(users)
                    .set({ userAgent: userAgent })
                    .where(eq(users.id, userInfo.id));

                // 6. Prepare JWT Payload
                const userPayload = {
                    userId: userInfo.id,
                    role: userInfo.role as UserRoleDto,
                    userAgent: userAgent,
                    exp: Helper.tokenExpriresIn, // Token expires in 30 days
                };

                // 7. Generate and set access token in cookies
                const token = await Helper.generateToken(userPayload);

                return {
                    token,
                    role: userInfo.role as UserRoleDto,
                }

            });
        } catch (error) {
            throw ErrorHandler.getErrorMessage(error);
        }
    }

    public static async sendCodeSignInOTP(ctx: MyContext) {
        try {
            const { email }: ZodValidationSendOTPToEmail = ctx.bodyInfo;

            // 1. Check if user exists in the Database
            const user = await db.query.users.findFirst({
                where: (users, { eq, and }) => and(
                    eq(users.email, email),
                    eq(users.isActive, true)
                )
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found"
                });
            }

            // 2. Generate a 6-digit random code
            const otpCode = Helper.generateOTP(); // e.g., "123456"

            return await db.transaction(async (tx) => {

                // 3. Store in Redis with an expiration (e.g.,   300 seconds)
                // Key format: "reset_password:email@example.com"
                const resetToken = crypto.randomUUID(); // raomdom token for reset password session
                await redis.set(`reset_email_sign_in:${resetToken}`, email, { ex: 300 }); // get email in token

                ctx.setCookie("reset_token_sign_in", resetToken, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 300 // 5 minutes
                });

                // 4. SEND THE EMAIL using our new Helper
                const emailSent = await MailServices.sendResetCodeEmailSignIn(email, otpCode);

                if (!emailSent.success) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to send email. Please try again later."
                    });
                }
                return HandlerSuccess.success("Reset code sent to your email successfully");
            });

        } catch (error) {
            throw ErrorHandler.getErrorMessage(error);
        }
    }

    public static async resendCodeSignInOTP(ctx: MyContext) {
        try {
            const tokenFromCookie = ctx.getCookie("reset_token_sign_in");
            const emailFromRedis = await redis.get(`reset_email_sign_in:${tokenFromCookie}`); // Get email associated with the OTP code

            if (!emailFromRedis) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "Session expired" });
            }

            const otpCode = Helper.generateOTP(); // e.g., "123456"

            const emailSent = await MailServices.sendResetCodeEmailSignIn(emailFromRedis as string, otpCode);

            if (!emailSent.success) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to send email. Please try again later."
                });
            }

            return HandlerSuccess.success("Reset code sent to your email successfully");
        } catch (error) {
            throw ErrorHandler.getErrorMessage(error);
        }
    }

    public static async signInOTP(ctx: MyContext): Promise<SignInResponseDto> {
        try {
            const info: ZodValidationSignInOTP = ctx.bodyInfo;
            const userAgent = ctx.userAgent || null;

            const tokenFromCookie = ctx.getCookie("reset_token_sign_in");
            const emailFromRedis = await redis.get(`reset_email_sign_in:${tokenFromCookie}`); // Get email associated with the OTP code

            if (!emailFromRedis) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "Session expired" });
            }

            // 1. Validate if user agent exists
            if (!userAgent) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User agent is required for security verification"
                });
            }

            // 2. verify OTP code with Redis
            const storedCode = await redis.get(`sign_in_otp:${emailFromRedis as string}`);
            if (!storedCode || storedCode !== info.code) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid or expired OTP code"
                });
            }

            // 3. Query user by email, role, and active status
            // Removed userAgent from the 'where' clause to allow login from new devices
            const userInfo = await db.query.users.findFirst({
                where: (users, { eq, and }) => and(
                    eq(users.email, emailFromRedis as string),
                    eq(users.isActive, true)
                )
            });

            // 4. Check if user exists
            if (!userInfo) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Invalid credentials or account is inactive"
                });
            }

            return await db.transaction(async (tx) => {

                // 5. Update the latest userAgent in the database
                // This ensures the DB stays synced with the current device
                await tx.update(users)
                    .set({ userAgent: userAgent })
                    .where(eq(users.id, userInfo.id));

                // 6. Prepare JWT Payload
                const userPayload = {
                    userId: userInfo.id,
                    role: userInfo.role as UserRoleDto,
                    userAgent: userAgent,
                    exp: Helper.tokenExpriresIn, // Token expires in 30 days
                };

                // 7. Generate and set access token in cookies
                const token = await Helper.generateToken(userPayload);

                await redis.del(`sign_in_otp:${emailFromRedis as string}`); // Clear OTP from Redis after successful login
                await redis.del(`reset_email_sign_in:${tokenFromCookie}`);
                ctx.setCookie("reset_token_sign_in", "", { maxAge: 0 }); // Clear the OTP session cookie

                return {
                    token,
                    role: userInfo.role as UserRoleDto,
                }

            });

        } catch (error) {
            throw ErrorHandler.getErrorMessage(error);
        }
    }


    public static async generateCodeResetPassword(email: string) {
        try {
            // 2. Generate a 6-digit random code
            const resetCode = Helper.generateOTP(); // e.g., "123456"

            return await db.transaction(async (tx) => {

                // 3. Store in Redis with an expiration (e.g., 5 minutes / 300 seconds)
                // Key format: "reset_password:email@example.com"
                await redis.set(`reset_password:${email}`, resetCode, { ex: 300 });

                // 4. SEND THE EMAIL using our new Helper
                const emailSent = await MailServices.sendResetCodeEmail(email, resetCode);

                if (!emailSent.success) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to send email. Please try again later."
                    });
                }
                return HandlerSuccess.success("Reset code sent to your email");
            });

        } catch (error) {
            throw ErrorHandler.getErrorMessage(error);
        }
    }

    // using to send OTP code to email for sign in and reset password, so no need to check user agent and role here
    public static async sendCodeResetPassword(ctx: MyContext) {
        try {
            const { email }: ZodValidationSendOTPToEmail = ctx.bodyInfo;

            // 1. Check if user exists in the Database
            const user = await db.query.users.findFirst({
                where: (users, { eq, and }) => and(
                    eq(users.email, email),
                    eq(users.isActive, true)
                ),
            });

            // Security Tip: Don't reveal if email exists or 
            // Just say "If an account exists, an email has been sent"
            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "If an account exists with that email, a reset code has been sent"
                });
            }

            return await db.transaction(async (tx) => {

                const resetToken = crypto.randomUUID(); // raomdom token for reset password session
                await redis.set(`reset_session:${resetToken}`, email, { ex: 300 }); // get email in token

                ctx.setCookie("reset_token", resetToken, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 300 // 5 minutes
                });

                return await this.generateCodeResetPassword(email);

            });

        } catch (error) {
            throw ErrorHandler.getErrorMessage(error);
        }
    }

    public static async resendCode(ctx: MyContext) {
        try {
            // 1.  Forgot Password (send OTP)

            // 2. Reset Password (Verify)
            const reset_token = ctx.getCookie("reset_token");
            const emailFromRedis = await redis.get(`reset_session:${reset_token}`);

            if (!emailFromRedis) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "Session expired" });
            }

            return await this.generateCodeResetPassword(emailFromRedis as string);

        } catch (error) {
            throw ErrorHandler.getErrorMessage(error);
        }
    }

    public static async resetPassword(ctx: MyContext) {
        try {
            // 1. Extract validation data from request body
            // Note: Email is no longer required in the body for enhanced security.
            const { code, password }: ZodValidationServerResetPassword = ctx.bodyInfo;

            // 2. Retrieve the reset session from the secure cookie
            const resetToken = ctx.getCookie("reset_token");

            // 3. Look up the associated email from Redis using the token
            const email = await redis.get(`reset_session:${resetToken}`);

            if (!email) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Reset session has expired. Please restart the process."
                });
            }

            // 4. Verify the OTP (One-Time Password) from Redis
            const storedCode = await redis.get(`reset_password:${email}`);

            if (!storedCode || storedCode !== code) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid or expired reset code."
                });
            }

            // 5. Hash the new password before storing it
            const hashedPassword = await Helper.bcryptHash(password);

            return await db.transaction(async (tx) => {
                // 6. Update the user's password in the database
                await tx.update(users)
                    .set({ password: hashedPassword })
                    .where(eq(users.email, email as string));

                // 7. Cleanup: Delete session and OTP data from Redis to prevent reuse
                await redis.del(`reset_password:${email as string}`);
                await redis.del(`reset_session:${resetToken}`);

                // 8. Clear the secure reset cookie from the client's browser
                ctx.setCookie("reset_token", "", { maxAge: 0 });

                return HandlerSuccess.success("Password has been reset successfully.");
            });

        } catch (error) {
            throw ErrorHandler.getErrorMessage(error);
        }
    }
}