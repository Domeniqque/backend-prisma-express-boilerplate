import { NextFunction, Request, Response } from "express";
import { logger } from "~/logger";
import {
  Middleware,
  ExpressErrorMiddlewareInterface,
  HttpError,
} from "routing-controllers";
import { Service } from "typedi";
import { ValidationError } from "class-validator";

@Service()
@Middleware({ type: "after" })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error(
    error: unknown,
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    if (!error) {
      next();
    }

    if (error instanceof Error) {
      // @ts-ignore
      const errors = error?.errors?.reduce((acc, err: ValidationError) => {
        if (!acc[err.property]) {
          acc[err.property] = [];
        }

        if (err.constraints) {
          Object.values(err.constraints).forEach((msg) => {
            acc[err.property].push(msg);
          });
        }

        return acc;
      }, {} as { [key: string]: string[] });

      return response.status(400).json({
        message: error.message,
        errors,
      });
    }

    logger.error(error, `[globalErrorHandling] Internal server error`);

    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}
