import { User } from "../../entities/User.entity";
import { RegisterUserDto } from "../dtos/auth.dto";

export interface UserRepository {
  create(userData: RegisterUserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
