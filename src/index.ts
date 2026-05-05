import * as functions from "firebase-functions";
import app from "./frameworks/server";
import { AppDataSource } from "./infrastructure/database/postgres";

// Initialize database for serverless environment
const initializeDb = async () => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("Database initialized for Firebase Functions.");
    } catch (error) {
      console.error("Failed to initialize database:", error);
    }
  }
};

// Wrap Express app in Firebase function
export const api = functions.https.onRequest(async (req, res) => {
  await initializeDb();
  return app(req, res);
});
