import { UserRepository } from "../interface/user.repository";
import { RegisterUserDto, LoginUserDto, AuthResponseDto } from "../dtos/auth.dto";
import { hashPassword, comparePassword } from "../../shared/utils/password.utils";
import { generateToken } from "../../shared/utils/jwt.utils";
import { ApiError } from "../../shared/utils/apiError";

export class AuthUseCases {
  constructor(private userRepository: UserRepository) {}

  async register(data: RegisterUserDto): Promise<AuthResponseDto> {
    if (!data.email || !data.password) {
      throw new ApiError(400, "BAD_REQUEST", "Email and password are required");
    }

    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ApiError(409, "CONFLICT", "User with this email already exists");
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
    });

    const token = generateToken({ id: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  }

  async login(data: LoginUserDto): Promise<AuthResponseDto> {
    if (!data.email || !data.password) {
      throw new ApiError(400, "BAD_REQUEST", "Email and password are required");
    }

    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new ApiError(401, "UNAUTHORIZED", "Invalid email or password");
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "UNAUTHORIZED", "Invalid email or password");
    }

    const token = generateToken({ id: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  }
}
