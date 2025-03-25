import { DataSource } from "typeorm";
import { databaseConfig } from "@modules/database/database.config";


const AppDataSource = new DataSource(databaseConfig);
export default AppDataSource;
