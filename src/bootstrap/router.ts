import "reflect-metadata";
import path from "path";
import { Application } from "express";
import { useExpressServer, useContainer } from "routing-controllers";
import { Container } from "typedi";

export function startRoutes(app: Application) {
  app.get("/ping", (_, response) => response.send("Pong"));

  useContainer(Container);

  useExpressServer(app, {
    controllers: [
      path.join(__dirname, "..", "/app/modules/**/controllers/*.ts"),
    ],
  });
}
