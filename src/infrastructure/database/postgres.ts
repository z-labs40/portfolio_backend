import { DataSource } from "typeorm";
import { config } from "../../config";
import { User } from "../../entities/User.entity";
import { Portfolio } from "../../entities/Portfolio.entity";
import { Logger } from "../../shared/logger";

const shouldSynchronize = config.env === "development";
const shouldLogQueries = config.env === "development";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  entities: [User, Portfolio],
  synchronize: shouldSynchronize,
  logging: shouldLogQueries,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const connectDB = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      Logger.info('Database connection established via TypeORM');
    }
  } catch (error) {
    Logger.error('Database connection error:', error);
    process.exit(1);
  }
};
