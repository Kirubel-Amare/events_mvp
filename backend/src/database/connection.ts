  import console from 'console';
import { AppDataSource } from '../config/database';

  // Prevent multiple initializations
  export const initializeDatabase = async () => {
    if (!AppDataSource.isInitialized) {
      try {
        await AppDataSource.initialize();
        console.log("Database connected successfully");
      } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
      }
    } else {
      console.log("Database already initialized");
    }
  };

  export { AppDataSource };
