"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_1 = require("express");
const auth_usecases_1 = require("../../application/usecases/auth.usecases");
const user_repoImpl_1 = require("../repositories/user.repoImpl");
class AuthController {
    router = (0, express_1.Router)({ mergeParams: true });
    authUseCases;
    constructor() {
        const userRepository = new user_repoImpl_1.UserRepositoryImpl();
        this.authUseCases = new auth_usecases_1.AuthUseCases(userRepository);
        this.router.post("/register", this.register.bind(this));
        this.router.post("/login", this.login.bind(this));
    }
    register = async (req, res, next) => {
        try {
            const userData = req.body;
            const result = await this.authUseCases.register(userData);
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const userData = req.body;
            const result = await this.authUseCases.login(userData);
            res.status(200).json({
                success: true,
                message: "Login successful",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
