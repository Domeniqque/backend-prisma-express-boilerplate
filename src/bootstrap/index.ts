import "reflect-metadata";
import "express-async-errors";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { loggerMiddleware } from "~/logger";
import { globalErrorHandling } from "~/app/http/middleware/globalErrorHandling.middleware";
import { startRoutes } from "./router";

const App = express();

App.use(cors());
App.use(express.json({ limit: "100kb" })); // default 100kb
App.use(express.urlencoded({ extended: true, limit: "100kb" })); // default 100kb
App.use(globalErrorHandling);
App.use(loggerMiddleware);

startRoutes(App);

export { App };
