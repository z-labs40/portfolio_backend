"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioUseCases = void 0;
const apiError_1 = require("../../shared/utils/apiError");
class PortfolioUseCases {
    portfolioRepository;
    constructor(portfolioRepository) {
        this.portfolioRepository = portfolioRepository;
    }
    mapToResponseDto(portfolio) {
        return {
            id: portfolio.id,
            userId: portfolio.userId,
            title: portfolio.title,
            description: portfolio.description,
            template: portfolio.template,
            content: portfolio.content,
            createdAt: portfolio.createdAt,
            updatedAt: portfolio.updatedAt,
        };
    }
    async createPortfolio(userId, data) {
        if (!data.title) {
            throw new apiError_1.ApiError(400, "BAD_REQUEST", "Title is required");
        }
        const portfolioData = {
            ...data,
            userId,
        };
        const portfolio = await this.portfolioRepository.create(portfolioData);
        return this.mapToResponseDto(portfolio);
    }
    async updatePortfolio(userId, id, data) {
        const existingPortfolio = await this.portfolioRepository.findById(id);
        if (!existingPortfolio) {
            throw new apiError_1.ApiError(404, "NOT_FOUND", "Portfolio not found");
        }
        if (existingPortfolio.userId !== userId) {
            throw new apiError_1.ApiError(403, "FORBIDDEN", "You do not have permission to update this portfolio");
        }
        const updatedPortfolio = await this.portfolioRepository.update(id, data);
        if (!updatedPortfolio) {
            throw new apiError_1.ApiError(500, "INTERNAL_ERROR", "Failed to update portfolio");
        }
        return this.mapToResponseDto(updatedPortfolio);
    }
    async getPortfolioById(id) {
        const portfolio = await this.portfolioRepository.findById(id);
        if (!portfolio) {
            throw new apiError_1.ApiError(404, "NOT_FOUND", "Portfolio not found");
        }
        return this.mapToResponseDto(portfolio);
    }
    async getPortfoliosByUser(userId) {
        const portfolios = await this.portfolioRepository.findByUserId(userId);
        return portfolios.map(p => this.mapToResponseDto(p));
    }
    async deletePortfolio(userId, id) {
        const existingPortfolio = await this.portfolioRepository.findById(id);
        if (!existingPortfolio) {
            throw new apiError_1.ApiError(404, "NOT_FOUND", "Portfolio not found");
        }
        if (existingPortfolio.userId !== userId) {
            throw new apiError_1.ApiError(403, "FORBIDDEN", "You do not have permission to delete this portfolio");
        }
        await this.portfolioRepository.delete(id);
    }
}
exports.PortfolioUseCases = PortfolioUseCases;
