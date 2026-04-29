"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryImpl = void 0;
const postgres_1 = require("../../infrastructure/database/postgres");
const User_entity_1 = require("../../entities/User.entity");
const logger_1 = require("../../shared/logger");
class UserRepositoryImpl {
    repository;
    constructor() {
        this.repository = postgres_1.AppDataSource.getRepository(User_entity_1.User);
    }
    async create(userData) {
        try {
            const user = this.repository.create(userData);
            const savedUser = await this.repository.save(user);
            logger_1.Logger.info(`User created successfully with ID: ${savedUser.id}`);
            return savedUser;
        }
        catch (error) {
            logger_1.Logger.error("Error creating user:", error);
            throw error;
        }
    }
    async findByEmail(email) {
        try {
            return await this.repository.findOne({ where: { email } });
        }
        catch (error) {
            logger_1.Logger.error("Error finding user by email:", error);
            throw error;
        }
    }
    async findById(id) {
        try {
            return await this.repository.findOne({ where: { id } });
        }
        catch (error) {
            logger_1.Logger.error("Error finding user by id:", error);
            throw error;
        }
    }
}
exports.UserRepositoryImpl = UserRepositoryImpl;
