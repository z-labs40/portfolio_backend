"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUseCases = void 0;
const password_utils_1 = require("../../shared/utils/password.utils");
const jwt_utils_1 = require("../../shared/utils/jwt.utils");
const apiError_1 = require("../../shared/utils/apiError");
class AuthUseCases {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async register(data) {
        if (!data.email || !data.password) {
            throw new apiError_1.ApiError(400, "BAD_REQUEST", "Email and password are required");
        }
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new apiError_1.ApiError(409, "CONFLICT", "User with this email already exists");
        }
        const hashedPassword = await (0, password_utils_1.hashPassword)(data.password);
        const user = await this.userRepository.create({
            email: data.email,
            password: hashedPassword,
        });
        const token = (0, jwt_utils_1.generateToken)({ id: user.id, email: user.email });
        return {
            user: {
                id: user.id,
                email: user.email,
            },
            token,
        };
    }
    async login(data) {
        if (!data.email || !data.password) {
            throw new apiError_1.ApiError(400, "BAD_REQUEST", "Email and password are required");
        }
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new apiError_1.ApiError(401, "UNAUTHORIZED", "Invalid email or password");
        }
        const isPasswordValid = await (0, password_utils_1.comparePassword)(data.password, user.password);
        if (!isPasswordValid) {
            throw new apiError_1.ApiError(401, "UNAUTHORIZED", "Invalid email or password");
        }
        const token = (0, jwt_utils_1.generateToken)({ id: user.id, email: user.email });
        return {
            user: {
                id: user.id,
                email: user.email,
            },
            token,
        };
    }
}
exports.AuthUseCases = AuthUseCases;
