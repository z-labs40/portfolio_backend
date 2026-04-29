import { Router, Response, NextFunction } from "express";
import { PortfolioUseCases } from "../../application/usecases/portfolio.usecases";
import { PortfolioRepositoryImpl } from "../repositories/portfolio.repoImpl";
import { authMiddleware, AuthRequest } from "../../shared/middleware/auth.middleware";
import { ApiError } from "../../shared/utils/apiError";

export class PortfolioController {
  public router: Router = Router({ mergeParams: true });
  private portfolioUseCases: PortfolioUseCases;

  constructor() {
    const portfolioRepository = new PortfolioRepositoryImpl();
    this.portfolioUseCases = new PortfolioUseCases(portfolioRepository);

    // Apply auth middleware to all portfolio routes
    this.router.use(authMiddleware);

    this.router.post("/", this.createPortfolio.bind(this));
    this.router.get("/", this.getMyPortfolios.bind(this));
    this.router.get("/:id", this.getPortfolioById.bind(this));
    this.router.put("/:id", this.updatePortfolio.bind(this));
    this.router.delete("/:id", this.deletePortfolio.bind(this));
  }

  createPortfolio = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) throw new ApiError(401, "UNAUTHORIZED", "User ID is missing");
      
      const portfolio = await this.portfolioUseCases.createPortfolio(req.user.id, req.body);
      
      res.status(201).json({
        success: true,
        message: "Portfolio created successfully",
        data: portfolio,
      });
    } catch (error) {
      next(error);
    }
  };

  updatePortfolio = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) throw new ApiError(401, "UNAUTHORIZED", "User ID is missing");
      const id = req.params.id as string;
      
      const portfolio = await this.portfolioUseCases.updatePortfolio(req.user.id, id, req.body);
      
      res.status(200).json({
        success: true,
        message: "Portfolio updated successfully",
        data: portfolio,
      });
    } catch (error) {
      next(error);
    }
  };

  getPortfolioById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const portfolio = await this.portfolioUseCases.getPortfolioById(id);
      
      res.status(200).json({
        success: true,
        data: portfolio,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyPortfolios = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) throw new ApiError(401, "UNAUTHORIZED", "User ID is missing");
      
      const portfolios = await this.portfolioUseCases.getPortfoliosByUser(req.user.id);
      
      res.status(200).json({
        success: true,
        data: portfolios,
        total: portfolios.length,
      });
    } catch (error) {
      next(error);
    }
  };

  deletePortfolio = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) throw new ApiError(401, "UNAUTHORIZED", "User ID is missing");
      const id = req.params.id as string;
      
      await this.portfolioUseCases.deletePortfolio(req.user.id, id);
      
      res.status(200).json({
        success: true,
        message: "Portfolio deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
