import { Portfolio } from "../../entities/Portfolio.entity";
import { CreatePortfolioDto, UpdatePortfolioDto } from "../dtos/portfolio.dto";

export interface PortfolioRepository {
  create(portfolioData: CreatePortfolioDto): Promise<Portfolio>;
  update(id: string, portfolioData: UpdatePortfolioDto): Promise<Portfolio | null>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<Portfolio | null>;
  findByUserId(userId: string): Promise<Portfolio[]>;
}
