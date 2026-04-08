import z from "zod";
import { zodValidationEmail, zodValidationOTPCode, zodValidationPassword, zodValidationPhoneNumber, zodValidationOTPCodeSignIn, zodValidationFirstName, zodValidationLastName, zodValidationGender, zodValidationConfirmPassword, zodValidationBirthday, zodRegistrationPassword } from "../variables";

export const zodValidationSignIn = z.object({
    email: zodValidationEmail,
    password: zodValidationPassword,
});

export const zodValidationSignInOTP = z.object({
    code: zodValidationOTPCodeSignIn
});

export const zodValidationSignUp = z.object({
    firstName: zodValidationFirstName,
    lastName: zodValidationLastName,
    email: zodValidationEmail,
    gender: zodValidationGender,
    birthDay: zodValidationBirthday,
    phoneNumber: zodValidationPhoneNumber,
    password: zodValidationPassword,
    confirmPassword: zodValidationConfirmPassword
}).refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password must match password",
    path: ["confirmPassword"], // This sets the error on the confirmPassword field specifically
});

export const zodValidationSendOTPToEmail = z.object({
    email: zodValidationEmail,
});

export const zodValidationVerifyPhoneNumber = z.object({
    phoneNumber: zodValidationPhoneNumber,
});

export const zodValidationVerifyOTPCode = z.object({
    email: zodValidationEmail,
    code: zodValidationOTPCode
});

// using for validation reset password form on client side, where user need to input new password and confirm password
export const zodValidationClientResetPassword = z.object({
    code: zodValidationOTPCode,
    password: zodValidationPassword,
    confirmPassword: zodValidationConfirmPassword
}).refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password must match password",
    path: ["confirmPassword"], // This sets the error on the confirmPassword field specifically
});

export const zodValidationServerResetPassword = z.object({
    code: zodValidationOTPCode,
    password: zodValidationPassword,
})
export type ZodValidationSignIn = z.infer<typeof zodValidationSignIn>;
export type ZodValidationSignInOTP = z.infer<typeof zodValidationSignInOTP>;
export type ZodValidationSignUp = z.infer<typeof zodValidationSignUp>;
export type ZodValidationSendOTPToEmail = z.infer<typeof zodValidationSendOTPToEmail>;
export type ZodValidationVerifyPhoneNumber = z.infer<typeof zodValidationVerifyPhoneNumber>;
export type ZodValidationVerifyOTPCode = z.infer<typeof zodValidationVerifyOTPCode>;
export type ZodValidationClientResetPassword = z.infer<typeof zodValidationClientResetPassword>;
export type ZodValidationServerResetPassword = z.infer<typeof zodValidationServerResetPassword>;