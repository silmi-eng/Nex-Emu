require("dotenv").config();

class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = (app) => {
  app.use((req, res, next) => next(new AppError("Page not found", 404)));

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    const isClientError = status >= 400 && status < 500;

    if (process.env.ENVIRONMENT === "test") {
      console.error(
        `Error: ${err.name}\nMessage: ${message}\nStack: ${err.stack}`
      );
    }

    res.status(status).json({
      status: isClientError ? "fail" : "error",
      statusCode: status,
      message,
    });
  });
};