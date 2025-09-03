import { env } from "@/lib/config"

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

class Logger {
  private level: LogLevel

  constructor() {
    this.level = env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG
  }

  private log(level: LogLevel, message: string, meta?: any) {
    if (level <= this.level) {
      const timestamp = new Date().toISOString()
      const levelName = LogLevel[level]

      const logEntry = {
        timestamp,
        level: levelName,
        message,
        ...(meta && { meta }),
      }

      if (env.NODE_ENV === "production") {
        // In production, you might want to send logs to a service like DataDog, LogRocket, etc.
        console.log(JSON.stringify(logEntry))
      } else {
        console.log(`[${timestamp}] ${levelName}: ${message}`, meta || "")
      }
    }
  }

  error(message: string, meta?: any) {
    this.log(LogLevel.ERROR, message, meta)
  }

  warn(message: string, meta?: any) {
    this.log(LogLevel.WARN, message, meta)
  }

  info(message: string, meta?: any) {
    this.log(LogLevel.INFO, message, meta)
  }

  debug(message: string, meta?: any) {
    this.log(LogLevel.DEBUG, message, meta)
  }
}

export const logger = new Logger()
