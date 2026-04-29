import { Router, Request, Response, NextFunction } from "express";
import { AuthUseCases } from "../../application/usecases/auth.usecases";
import { UserRepositoryImpl } from "../repositories/user.repoImpl";
import { RegisterUserDto, LoginUserDto } from "../../application/dtos/auth.dto";

export class AuthController {
  public router: Router = Router({ mergeParams: true });
  private authUseCases: AuthUseCases;

  constructor() {
    const userRepository = new UserRepositoryImpl();
    this.authUseCases = new AuthUseCases(userRepository);

    this.router.post("/register", this.register.bind(this));
    this.router.post("/login", this.login.bind(this));
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: RegisterUserDto = req.body;
      const result = await this.authUseCases.register(userData);
      
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: LoginUserDto = req.body;
      const result = await this.authUseCases.login(userData);
      
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
