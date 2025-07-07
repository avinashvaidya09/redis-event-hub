import Redis from "ioredis";
import { getRedisConnectionConfiguration } from "../../redis-config/RedisConnectionConfig"; 

const redisConnectionConfig = getRedisConnectionConfiguration();
if (!redisConnectionConfig) {
    throw new Error("Redis connection configuration is undefined");
}
const redis = new Redis(redisConnectionConfig);

export async function setFeatureFlag(key:string, value: boolean): Promise<boolean> {
    try {
        await redis.set(key, value ? "true" : "false");
        console.info(`Feature flag ${key} set to ${value}`);
        return true;
    } catch (error) {
        console.error(`Error setting feature flag ${key}:`, error);
        throw error;
    }
}

export async function getFeatureFlag(key: string): Promise<boolean> {
    try {
        const value = await redis.get(key);
        if (value === null) {
            console.warn(`Feature flag ${key} not found`);
            return false; // Default to false if not set
        }
        const flagValue = value === "true";
        console.info(`Feature flag ${key} retrieved: ${flagValue}`);
        return flagValue;
    } catch (error) {
        console.error(`Error getting feature flag ${key}:`, error);
        throw error;
    }
}