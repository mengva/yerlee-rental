import { Resend } from 'resend';
import { env } from '../config/env';

// 1. Initialize Resend with your API Key
const resend = new Resend(env("RESEND_API_KEY"));

export class MailServices {

    // using to send reset Your Password form
    public static async sendResetCodeEmail(email: string, code: string) {
        try {
            const { data, error } = await resend.emails.send({
                from: 'Yerlee Rental <onboarding@resend.dev>', // Default testing email
                to: email,
                subject: 'Verification Code: Reset Your Password',
                html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>We received a request to reset your password. Please use the verification code below:</p>
                    <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff;">
                        ${code}
                        </span>
                    </div>
                    <p style="margin-top: 20px; color: #666;">This code will expire in <strong>30 seconds</strong>.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999;">Yerlee Rental System Project</p>
                </div>
            `,
            });

            if (error) {
                return { success: false, error };
            }

            return { success: true, data };
        } catch (err) {
            return { success: false, error: err };
        }
    }

    public static async sendResetCodeEmailSignIn(email: string, code: string) {
        try {
            const { data, error } = await resend.emails.send({
                from: 'Yerlee Rental <onboarding@resend.dev>', // Default testing email
                to: email,
                subject: 'Verification Code: Sign In to Your Account',
                html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #333;">Sign In Request</h2>
                    <p>We received a request to sign in to your account. Please use the verification code below:</p>
                    <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff;">
                        ${code}
                        </span>
                    </div>
                    <p style="margin-top: 20px; color: #666;">This code will expire in <strong>30 seconds</strong>.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999;">Yerlee Rental System Project</p>
                </div>
            `,
            });

            if (error) {
                return { success: false, error };
            }

            return { success: true, data };
        } catch (err) {
            return { success: false, error: err };
        }
    }

}