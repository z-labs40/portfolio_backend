import "reflect-metadata";
import dotenv from "dotenv";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../infrastructure/database/postgres";
import { ApiError } from "../shared/utils/apiError";
import { registerRoutes } from "../config/routes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? "3000");
const host = process.env.HOST ?? "0.0.0.0";

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  const isDbConnected = AppDataSource.isInitialized;
  res.status(isDbConnected ? 200 : 503).json({
    ok: isDbConnected,
    database: isDbConnected ? "connected" : "disconnected",
  });
});

app.use("/api", registerRoutes());

app.use((_req, _res, next) => {
  next(new ApiError(404, "NOT_FOUND", "Route not found"));
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
    });
  }

  console.error("Unhandled server error:", err);
  return res.status(500).json({
    code: "INTERNAL",
    message: "Unexpected server error",
  });
});

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established.");

    const server = app.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}.`);
    });

    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}. Shutting down...`);
      server.close(async () => {
        if (AppDataSource.isInitialized) {
          await AppDataSource.destroy();
          console.log("Database connection closed.");
        }
        process.exit(0);
      });
    };

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });

    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  void bootstrap();
}

export const handler = app; // For serverless
export default app;
