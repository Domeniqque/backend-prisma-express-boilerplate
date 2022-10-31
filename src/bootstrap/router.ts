import "reflect-metadata";
import path from "path";
import { Application } from "express";
import { useExpressServer, useContainer } from "routing-controllers";
import { Container } from "typedi";
import { GlobalErrorHandler } from "~/app/http/middleware/global-error-handling.middleware";

export function startRoutes(app: Application) {
  app.get("/ping", (_, response) => response.send("Pong"));

  useContainer(Container);

  useExpressServer(app, {
    controllers: [
      path.join(__dirname, "..", "/app/modules/**/controllers/*.ts"),
    ],
    middlewares: [GlobalErrorHandler],
    defaultErrorHandler: false,
  });
}
