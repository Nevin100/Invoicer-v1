import winston from "winston";

const { combine, timestamp, colorize, printf, json, errors } = winston.format;

const serializeErrors = winston.format((info) => {
  for (const key of Object.keys(info)) {
    if (info[key] instanceof Error) {
      const err = info[key] as Error;
      info[key] = {
        message: err.message,
        name: err.name,
        stack: err.stack,
        ...(err as any).error,        
        ...(err as any).response?.data, 
      };
    }
  }
  return info;
});

const devFormat = combine(
  serializeErrors(),
  colorize({ all: true }),
  timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : "";
    return `[${timestamp}] ${level}: ${stack || message}${metaStr}`;
  })
);

const prodFormat = combine(
  serializeErrors(),
  timestamp(),
  errors({ stack: true }),
  json()
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",
  format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),

    ...(process.env.NODE_ENV !== "production"
      ? [
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
          }),
          new winston.transports.File({
            filename: "logs/combined.log",
          }),
        ]
      : []),
  ],
});

export default logger;