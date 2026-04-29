"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../../adapters/controllers/auth.controller");
const portfolio_controller_1 = require("../../adapters/controllers/portfolio.controller");
const registerRoutes = () => {
    const router = (0, express_1.Router)();
    const authController = new auth_controller_1.AuthController();
    const portfolioController = new portfolio_controller_1.PortfolioController();
    router.use("/auth", authController.router);
    router.use("/portfolios", portfolioController.router);
    return router;
};
exports.registerRoutes = registerRoutes;
