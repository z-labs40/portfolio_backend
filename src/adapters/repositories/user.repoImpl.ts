import { Repository } from "typeorm";
import { AppDataSource } from "../../infrastructure/database/postgres";
import { User } from "../../entities/User.entity";
import { UserRepository } from "../../application/interface/user.repository";
import { RegisterUserDto } from "../../application/dtos/auth.dto";
import { Logger } from "../../shared/logger";

export class UserRepositoryImpl implements UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async create(userData: RegisterUserDto): Promise<User> {
    try {
      const user = this.repository.create(userData);
      const savedUser = await this.repository.save(user);
      Logger.info(`User created successfully with ID: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      Logger.error("Error creating user:", error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { email } });
    } catch (error) {
      Logger.error("Error finding user by email:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      Logger.error("Error finding user by id:", error);
      throw error;
    }
  }
}
