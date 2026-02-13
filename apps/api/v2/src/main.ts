// main.ts — Application entrypoint for the Cal.com Platform API (v2).
//
// Startup sequence:
//   1. createNestApp() instantiates the NestJS application from AppModule
//      with Winston structured logging and body parsing disabled (handled
//      by custom middleware in app.module.ts).
//   2. bootstrap(app) in app.ts applies global configuration: API versioning,
//      CORS, Helmet security, validation pipes, and exception filters.
//   3. generateSwaggerForApp(app) produces the OpenAPI spec at /docs.
//   4. The server starts listening on the port from AppConfig (default 3003).
//
// If startup fails, the process exits with code 1 and logs the error.

import type { AppConfig } from "@/config/type";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import "dotenv/config";
import { WinstonModule } from "nest-winston";

import { bootstrap } from "./app";
import { AppModule } from "./app.module";
import { loggerConfig } from "./lib/logger";
import { generateSwaggerForApp } from "./swagger/generate-swagger";

run().catch((error: Error) => {
  console.error("Failed to start Cal Platform API", { error: error.stack });
  process.exit(1);
});

async function run() {
  const app = await createNestApp();
  const logger = new Logger("App");

  try {
    bootstrap(app);
    const port = app.get(ConfigService<AppConfig, true>).get("api.port", { infer: true });
    generateSwaggerForApp(app);
    await app.listen(port);
    logger.log(`Application started on port: ${port}`);
  } catch (error) {
    console.error(error);
    logger.error("Application crashed", {
      error,
    });
  }
}

export async function createNestApp() {
  return NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig()),
    bodyParser: false,
  });
}
