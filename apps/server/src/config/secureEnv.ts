import * as dotenv from "dotenv"

dotenv.config()

export class SecureEnv {
    private static requiredVars = [
        'PORT',
        'DATABASE_URL',
        'ALGORITHM',
        'ACCESS_TOKEN_EXPIRES_IN',
        'USER_SECRET',
        'SESSION_SECRET',
        'CORS_ORIGIN',
        'NODE_ENV',
        "REDIS_PORT",
        "UPSTASH_REDIS_REST_URL",
        "UPSTASH_REDIS_REST_TOKEN",
        "RESEND_API_KEY",
        "UPLOADTHING_SECRET",
        "UPLOADTHING_APP_ID"
    ] as const;

    public static validate() {
        const missing = this.requiredVars.filter(
            varName => !process.env[varName]
        );

        if (missing.length > 0) {
            throw new Error(
                `Missing required environment variables: ${missing.join(', ')}\n` +
                'Please check your .env file'
            );
        }

        // ตรวจสอบความแข็งแรงของ secrets
        const secrets = ['USER_SECRET', 'SESSION_SECRET'];
        for (const secret of secrets) {
            const value = process.env[secret]!;
            if (value.length < 32) {
                throw new Error(`${secret} must be at least 32 characters long`);
            }
        }
    }

    public static get(key: string): string {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Environment variable ${key} is not set`);
        }
        return value;
    }
}