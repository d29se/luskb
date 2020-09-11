const config = require("./config");
const logger = require("./logger");
const express = require("express");
const app = express();
const services = require("./services");
const controllers = require("./controllers");
const cors = require("cors");

app.use(cors());
// Init API routes & controllers
app.use(controllers);

// Express error handler
app.use((err, req, res, next) => {
  logger.error("Express API error", { error: err.message || undefined });
  // Send error (stack) to stderr if not in production
  if (config.NODE_ENV !== "production") {
    console.error("DevStack Error:", err.stack);
  }

  // Send response status code and error
  res.status(err.statusCode || 500);
  res.send({
    error: {
      status: err.statusCode || 500,
      message: err.message || "Internal server error",
      source: err.source || "luskb",
    },
  });
});

const appShutdown = (error) => {
  logger.error("Application shutdown called", { detail: error.message });
  setTimeout(() => {
    process.exit(1);
  }, 1000);
};

// Establish main DB connection & run the app
services.databases.db1
  .mongoConnect()
  .then((db) => {
    app.listen(config.APP_PORT);
    db.admin().serverStatus((err, res) => {
      if (err) {
        appShutdown(err);
      } else {
        logger.info(
          `Application started (port: ${config.APP_PORT}, db1version: ${res.version})`
        );
      }
    });
  })
  .catch((error) => {
    appShutdown(error);
  });
