import { AppDataSource } from '../config/database';
import { initializeDatabase } from './connection';

const syncDatabase = async () => {
    try {
        console.log("Starting database synchronization...");
        await initializeDatabase();

        // This will create tables based on your entities
        await AppDataSource.synchronize();

        console.log("Database synchronization completed successfully");
        process.exit(0);
    } catch (err) {
        console.error("Database synchronization failed:", err);
        process.exit(1);
    }
};

syncDatabase();
