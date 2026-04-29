"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioController = void 0;
const express_1 = require("express");
const portfolio_usecases_1 = require("../../application/usecases/portfolio.usecases");
const portfolio_repoImpl_1 = require("../repositories/portfolio.repoImpl");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const apiError_1 = require("../../shared/utils/apiError");
class PortfolioController {
    router = (0, express_1.Router)({ mergeParams: true });
    portfolioUseCases;
    constructor() {
        const portfolioRepository = new portfolio_repoImpl_1.PortfolioRepositoryImpl();
        this.portfolioUseCases = new portfolio_usecases_1.PortfolioUseCases(portfolioRepository);
        // Apply auth middleware to all portfolio routes
        this.router.use(auth_middleware_1.authMiddleware);
        this.router.post("/", this.createPortfolio.bind(this));
        this.router.get("/", this.getMyPortfolios.bind(this));
        this.router.get("/:id", this.getPortfolioById.bind(this));
        this.router.put("/:id", this.updatePortfolio.bind(this));
        this.router.delete("/:id", this.deletePortfolio.bind(this));
    }
    createPortfolio = async (req, res, next) => {
        try {
            if (!req.user?.id)
                throw new apiError_1.ApiError(401, "UNAUTHORIZED", "User ID is missing");
            const portfolio = await this.portfolioUseCases.createPortfolio(req.user.id, req.body);
            res.status(201).json({
                success: true,
                message: "Portfolio created successfully",
                data: portfolio,
            });
        }
        catch (error) {
            next(error);
        }
    };
    updatePortfolio = async (req, res, next) => {
        try {
            if (!req.user?.id)
                throw new apiError_1.ApiError(401, "UNAUTHORIZED", "User ID is missing");
            const id = req.params.id;
            const portfolio = await this.portfolioUseCases.updatePortfolio(req.user.id, id, req.body);
            res.status(200).json({
                success: true,
                message: "Portfolio updated successfully",
                data: portfolio,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getPortfolioById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const portfolio = await this.portfolioUseCases.getPortfolioById(id);
            res.status(200).json({
                success: true,
                data: portfolio,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getMyPortfolios = async (req, res, next) => {
        try {
            if (!req.user?.id)
                throw new apiError_1.ApiError(401, "UNAUTHORIZED", "User ID is missing");
            const portfolios = await this.portfolioUseCases.getPortfoliosByUser(req.user.id);
            res.status(200).json({
                success: true,
                data: portfolios,
                total: portfolios.length,
            });
        }
        catch (error) {
            next(error);
        }
    };
    deletePortfolio = async (req, res, next) => {
        try {
            if (!req.user?.id)
                throw new apiError_1.ApiError(401, "UNAUTHORIZED", "User ID is missing");
            const id = req.params.id;
            await this.portfolioUseCases.deletePortfolio(req.user.id, id);
            res.status(200).json({
                success: true,
                message: "Portfolio deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.PortfolioController = PortfolioController;
