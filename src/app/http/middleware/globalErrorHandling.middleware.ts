import { NextFunction, Request, Response } from "express";
import { logger } from "~/logger";

export function globalErrorHandling(
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.log("------>", err);
  if (err instanceof Error) {
    return response.status(400).json({
      message: err.message,
    });
  }

  logger.error(err, `[globalErrorHandling] Internal server error`);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
}
