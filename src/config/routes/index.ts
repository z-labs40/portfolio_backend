import { Router } from "express";
import { AuthController } from "../../adapters/controllers/auth.controller";
import { PortfolioController } from "../../adapters/controllers/portfolio.controller";

export const registerRoutes = (): Router => {
  const router = Router();

  const authController = new AuthController();
  const portfolioController = new PortfolioController();

  router.use("/auth", authController.router);
  router.use("/portfolios", portfolioController.router);

  return router;
};
