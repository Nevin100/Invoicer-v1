import { Ratelimit } from "@upstash/ratelimit";
import redis from "./redis";

// Sensitive Endpoint for speciic endpoints
export const sensitiveRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "invoicer:sensitive",
});

// general rate Liimit for all endpoints
export const generalRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  analytics: true,
  prefix: "invoicer:general",
});