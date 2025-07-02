
/**
 * Retrieves the Redis  configuration.
 * @returns The Redis connection configuration.
 */
export function getRedisConnectionConfiguration() {
    
    if (process.env.NODE_ENV === "development") {
        // Fallback to environment variables if local development
        return {
            host: process.env.REDIS_HOST || "localhost",
            port: Number(process.env.REDIS_PORT) || 6379,
        };
    }

    if (process.env.VCAP_SERVICES && process.env.VCAP_SERVICES.includes("redis-cache")) {
        try {
            const vcapServices = JSON.parse(process.env.VCAP_SERVICES);
            const redisService = vcapServices["redis-cache"][0].credentials;
            return {
                host: redisService.hostname,
                port: redisService.port,
                password: redisService.password,
                tls: redisService.tls ? {} : undefined, // Optional TLS configuration
            };
        } catch (error) {
            console.error("Error parsing VCAP_SERVICES for Redis connection", error);
            throw new Error("Invalid VCAP_SERVICES format");
        }
    } else {
        throw new Error("Redis connection configuration is undefined");
    }

    
}