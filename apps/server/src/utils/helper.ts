import * as bcrypt from "bcryptjs"
import { env } from "../config/env";
import * as jwt from "jsonwebtoken";
import { UserRoleDto } from "@/server/packages/types/constants/variables";
// import {jwt, decode, sign, verify} from "hono/jwt"

export type SignDto = "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512";

interface PayloadDto {
    userId: string;
    role: UserRoleDto;
    userAgent: string;
    exp: number; // Expiration time in seconds since the epoch
}

export interface MailOptionsDto {
    from: string;
    to: string;
    subject: string;
    html: string;
}

export interface CookieOptionDto {
    sameSite: 'strict' | 'lax' | 'none';
    secure: boolean;
    httpOnly: boolean;
    domain: string;
    maxAge: number;
    path: string;
}

export class Helper {

    public static isProduction = env("NODE_ENV") === 'production'

    public static tokenExpriresIn = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30); // 30 days in seconds

    public static cookieOption: CookieOptionDto = {
        sameSite: this.isProduction ? 'strict' : 'lax',
        secure: this.isProduction,
        httpOnly: true,
        domain: 'localhost',
        maxAge: 60 * 60 * 24 * 30, // 30d 
        path: '/',
    }

    public static async generateToken(payload: PayloadDto): Promise<string> {
        const secret = env("USER_SECRET");
        const expiresIn = env("ACCESS_TOKEN_EXPIRES_IN"); // Example: "1d" or "24h"

        if (!secret) {
            throw new Error("Secret key is not defined in environment variables");
        }

        const signOptions: jwt.SignOptions = {
            algorithm: env("ALGORITHM") as jwt.Algorithm,
            // If your env is a string like "1d", remove parseInt. 
            // If it's a number of seconds, keep parseInt.
            expiresIn: expiresIn as any
        };

        return jwt.sign(payload, secret, signOptions);
    }

    public static async verifyTokenSecret(token: string): Promise<PayloadDto> {
        if (!token) {
            throw new Error("Token is not provided");
        }

        const secret = env("USER_SECRET");
        if (!secret) {
            throw new Error("Secret key is not defined");
        }

        try {
            // We use a manual Promise to handle potential errors cleanly
            const decoded = jwt.verify(token, secret) as PayloadDto;
            return decoded;
        } catch (error) {
            // Handle expired or malformed token
            throw new Error("Invalid or expired token");
        }
    }

    public static async bcryptHash(code: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(code, salt);
        return hashed;
    }

    public static async bcryptCompare(code: string, hashedCode: string) {
        return await bcrypt.compare(code, hashedCode);
    }

    public static generateOTP() {
        // Generate a random 6 digit OTP
        return (Math.floor(100000 + Math.random() * 900000)).toString() as string;
    }

    public static generateOTPSignIn() {
        // Generate a random 8 digit OTP for sign in
        return (Math.floor(10000000 + Math.random() * 90000000)).toString() as string;
    }

    public static codeExpiredIn(second: number) {
        // Set the OTP code to expire in m minutes
        return new Date(Date.now() + second * 1000) as Date;
    }

    public static currentDate() {
        // Get the current date and time
        return new Date(Date.now()) as Date;
    }

    public static setCurrentDate(day: number) {
        return new Date(Date.now() + day);
    }
}