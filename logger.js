const config = require("./config");
const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const transport = new winston.transports.DailyRotateFile({
  dirname: "./logs",
  filename: "luskb-%DATE%.log",
  maxSize: "20m",
  maxFiles: "14d",
});

const logger = winston.createLogger({
  level: config.NODE_ENV == "production" ? "error" : "debug",
  transports: [transport],
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD hh:mm:ss A ZZ",
    }),
    winston.format.json()
  ),
});

if (config.nodeEnv !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
