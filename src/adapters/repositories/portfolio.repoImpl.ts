import { Repository } from "typeorm";
import { AppDataSource } from "../../infrastructure/database/postgres";
import { Portfolio } from "../../entities/Portfolio.entity";
import { PortfolioRepository } from "../../application/interface/portfolio.repository";
import { CreatePortfolioDto, UpdatePortfolioDto } from "../../application/dtos/portfolio.dto";
import { Logger } from "../../shared/logger";

export class PortfolioRepositoryImpl implements PortfolioRepository {
  private repository: Repository<Portfolio>;

  constructor() {
    this.repository = AppDataSource.getRepository(Portfolio);
  }

  async create(portfolioData: CreatePortfolioDto): Promise<Portfolio> {
    try {
      const portfolio = this.repository.create(portfolioData);
      const savedPortfolio = await this.repository.save(portfolio);
      Logger.info(`Portfolio created successfully with ID: ${savedPortfolio.id}`);
      return savedPortfolio;
    } catch (error) {
      Logger.error("Error creating portfolio:", error);
      throw error;
    }
  }

  async update(id: string, portfolioData: UpdatePortfolioDto): Promise<Portfolio | null> {
    try {
      await this.repository.update(id, portfolioData);
      const updatedPortfolio = await this.repository.findOne({ where: { id } });
      if (updatedPortfolio) {
        Logger.info(`Portfolio updated successfully with ID: ${id}`);
      }
      return updatedPortfolio || null;
    } catch (error) {
      Logger.error("Error updating portfolio:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      const deleted = result.affected ? result.affected > 0 : false;
      if (deleted) {
        Logger.info(`Portfolio deleted successfully with ID: ${id}`);
      }
      return deleted;
    } catch (error) {
      Logger.error("Error deleting portfolio:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<Portfolio | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      Logger.error("Error finding portfolio by ID:", error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Portfolio[]> {
    try {
      return await this.repository.find({ where: { userId } });
    } catch (error) {
      Logger.error("Error finding portfolios by User ID:", error);
      throw error;
    }
  }
}
