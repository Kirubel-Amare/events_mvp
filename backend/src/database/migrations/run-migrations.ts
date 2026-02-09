import { AppDataSource, initializeDatabase } from "../connection"

const runMigrations = async () => {
  try {
    // Make sure DB is initialized
    await initializeDatabase()

    // Now run migrations safely
    await AppDataSource.runMigrations()
    console.log("Migrations ran successfully")
  } catch (err) {
    console.error("Migration failed:", err)
  } finally {
    // Optional: close connection if not running server immediately
    // await AppDataSource.destroy()
  }
}

runMigrations()
