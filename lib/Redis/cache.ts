import redis from "./redis";

const DEFAULT_TTL = 60 * 5; 

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    if (!data) return null;
    return typeof data === "string" ? JSON.parse(data) : (data as T);
  },

  async set(key: string, value: unknown, ttl = DEFAULT_TTL) {
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  async del(key: string) {
    await redis.del(key);
  },

  async invalidate(pattern: string) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  },
};