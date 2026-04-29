"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const postgres_1 = require("../infrastructure/database/postgres");
const apiError_1 = require("../shared/utils/apiError");
const routes_1 = require("../config/routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT ?? "3000");
const host = process.env.HOST ?? "0.0.0.0";
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (_req, res) => {
    const isDbConnected = postgres_1.AppDataSource.isInitialized;
    res.status(isDbConnected ? 200 : 503).json({
        ok: isDbConnected,
        database: isDbConnected ? "connected" : "disconnected",
    });
});
app.use("/api", (0, routes_1.registerRoutes)());
app.use((_req, _res, next) => {
    next(new apiError_1.ApiError(404, "NOT_FOUND", "Route not found"));
});
app.use((err, _req, res, _next) => {
    if (err instanceof apiError_1.ApiError) {
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
        await postgres_1.AppDataSource.initialize();
        console.log("Database connection established.");
        const server = app.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}.`);
        });
        const shutdown = async (signal) => {
            console.log(`Received ${signal}. Shutting down...`);
            server.close(async () => {
                if (postgres_1.AppDataSource.isInitialized) {
                    await postgres_1.AppDataSource.destroy();
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
    }
    catch (error) {
        console.error("Failed to initialize server:", error);
        process.exit(1);
    }
}
if (require.main === module) {
    void bootstrap();
}
exports.handler = app; // For serverless
exports.default = app;
