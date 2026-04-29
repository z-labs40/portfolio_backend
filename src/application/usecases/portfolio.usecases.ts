import { PortfolioRepository } from "../interface/portfolio.repository";
import { CreatePortfolioDto, UpdatePortfolioDto, PortfolioResponseDto } from "../dtos/portfolio.dto";
import { Portfolio } from "../../entities/Portfolio.entity";
import { ApiError } from "../../shared/utils/apiError";

export class PortfolioUseCases {
  constructor(private portfolioRepository: PortfolioRepository) {}

  private mapToResponseDto(portfolio: Portfolio): PortfolioResponseDto {
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

  async createPortfolio(userId: string, data: Omit<CreatePortfolioDto, "userId">): Promise<PortfolioResponseDto> {
    if (!data.title) {
      throw new ApiError(400, "BAD_REQUEST", "Title is required");
    }

    const portfolioData: CreatePortfolioDto = {
      ...data,
      userId,
    };

    const portfolio = await this.portfolioRepository.create(portfolioData);
    return this.mapToResponseDto(portfolio);
  }

  async updatePortfolio(userId: string, id: string, data: UpdatePortfolioDto): Promise<PortfolioResponseDto> {
    const existingPortfolio = await this.portfolioRepository.findById(id);
    
    if (!existingPortfolio) {
      throw new ApiError(404, "NOT_FOUND", "Portfolio not found");
    }

    if (existingPortfolio.userId !== userId) {
      throw new ApiError(403, "FORBIDDEN", "You do not have permission to update this portfolio");
    }

    const updatedPortfolio = await this.portfolioRepository.update(id, data);
    if (!updatedPortfolio) {
      throw new ApiError(500, "INTERNAL_ERROR", "Failed to update portfolio");
    }

    return this.mapToResponseDto(updatedPortfolio);
  }

  async getPortfolioById(id: string): Promise<PortfolioResponseDto> {
    const portfolio = await this.portfolioRepository.findById(id);
    if (!portfolio) {
      throw new ApiError(404, "NOT_FOUND", "Portfolio not found");
    }
    return this.mapToResponseDto(portfolio);
  }

  async getPortfoliosByUser(userId: string): Promise<PortfolioResponseDto[]> {
    const portfolios = await this.portfolioRepository.findByUserId(userId);
    return portfolios.map(p => this.mapToResponseDto(p));
  }

  async deletePortfolio(userId: string, id: string): Promise<void> {
    const existingPortfolio = await this.portfolioRepository.findById(id);
    
    if (!existingPortfolio) {
      throw new ApiError(404, "NOT_FOUND", "Portfolio not found");
    }

    if (existingPortfolio.userId !== userId) {
      throw new ApiError(403, "FORBIDDEN", "You do not have permission to delete this portfolio");
    }

    await this.portfolioRepository.delete(id);
  }
}
