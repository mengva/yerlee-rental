import { Redis } from "@upstash/redis";
import { env } from "../config/env";

// Using environment variables for security
const redisUrl = env("UPSTASH_REDIS_REST_URL");
const redisToken = env("UPSTASH_REDIS_REST_TOKEN");

if (!redisUrl || !redisToken) {
  throw new Error("Redis credentials are missing in .env file");
}

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});