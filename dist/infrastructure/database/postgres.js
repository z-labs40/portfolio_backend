"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../../config");
const User_entity_1 = require("../../entities/User.entity");
const Portfolio_entity_1 = require("../../entities/Portfolio.entity");
const logger_1 = require("../../shared/logger");
const shouldSynchronize = config_1.config.env === "development";
const shouldLogQueries = config_1.config.env === "development";
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: config_1.config.db.host,
    port: config_1.config.db.port,
    username: config_1.config.db.username,
    password: config_1.config.db.password,
    database: config_1.config.db.database,
    entities: [User_entity_1.User, Portfolio_entity_1.Portfolio],
    synchronize: shouldSynchronize,
    logging: shouldLogQueries,
    ssl: {
        rejectUnauthorized: false,
    },
});
const connectDB = async () => {
    try {
        if (!exports.AppDataSource.isInitialized) {
            await exports.AppDataSource.initialize();
            logger_1.Logger.info('Database connection established via TypeORM');
        }
    }
    catch (error) {
        logger_1.Logger.error('Database connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
