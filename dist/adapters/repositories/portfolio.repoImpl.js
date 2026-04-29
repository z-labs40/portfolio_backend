"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioRepositoryImpl = void 0;
const postgres_1 = require("../../infrastructure/database/postgres");
const Portfolio_entity_1 = require("../../entities/Portfolio.entity");
const logger_1 = require("../../shared/logger");
class PortfolioRepositoryImpl {
    repository;
    constructor() {
        this.repository = postgres_1.AppDataSource.getRepository(Portfolio_entity_1.Portfolio);
    }
    async create(portfolioData) {
        try {
            const portfolio = this.repository.create(portfolioData);
            const savedPortfolio = await this.repository.save(portfolio);
            logger_1.Logger.info(`Portfolio created successfully with ID: ${savedPortfolio.id}`);
            return savedPortfolio;
        }
        catch (error) {
            logger_1.Logger.error("Error creating portfolio:", error);
            throw error;
        }
    }
    async update(id, portfolioData) {
        try {
            await this.repository.update(id, portfolioData);
            const updatedPortfolio = await this.repository.findOne({ where: { id } });
            if (updatedPortfolio) {
                logger_1.Logger.info(`Portfolio updated successfully with ID: ${id}`);
            }
            return updatedPortfolio || null;
        }
        catch (error) {
            logger_1.Logger.error("Error updating portfolio:", error);
            throw error;
        }
    }
    async delete(id) {
        try {
            const result = await this.repository.delete(id);
            const deleted = result.affected ? result.affected > 0 : false;
            if (deleted) {
                logger_1.Logger.info(`Portfolio deleted successfully with ID: ${id}`);
            }
            return deleted;
        }
        catch (error) {
            logger_1.Logger.error("Error deleting portfolio:", error);
            throw error;
        }
    }
    async findById(id) {
        try {
            return await this.repository.findOne({ where: { id } });
        }
        catch (error) {
            logger_1.Logger.error("Error finding portfolio by ID:", error);
            throw error;
        }
    }
    async findByUserId(userId) {
        try {
            return await this.repository.find({ where: { userId } });
        }
        catch (error) {
            logger_1.Logger.error("Error finding portfolios by User ID:", error);
            throw error;
        }
    }
}
exports.PortfolioRepositoryImpl = PortfolioRepositoryImpl;
