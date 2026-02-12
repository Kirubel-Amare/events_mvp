import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config/env';
import { corsOptions } from './config/cors';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { initializeDatabase } from './database/connection';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import eventRoutes from './routes/event.routes';
import planRoutes from './routes/plan.routes';
import organizerRoutes from './routes/organizer.routes';
import feedRoutes from './routes/feed.routes';
import adminRoutes from './routes/admin.routes';
import uploadRoutes from './routes/upload.routes';
import notificationRoutes from './routes/notification.routes';
import quotaRoutes from './routes/quota.routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    }));
    this.app.use(cors(corsOptions));

    // Compression
    this.app.use(compression());

    // Logging
    if (config.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    }

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Static files
    this.app.use('/uploads', express.static('public/uploads'));
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/api/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
        version: config.apiVersion,
      });
    });

    // API Routes
    this.app.use(`/api/${config.apiVersion}/auth`, authRoutes);
    this.app.use(`/api/${config.apiVersion}/users`, userRoutes);
    this.app.use(`/api/${config.apiVersion}/events`, eventRoutes);
    this.app.use(`/api/${config.apiVersion}/plans`, planRoutes);
    this.app.use(`/api/${config.apiVersion}/organizers`, organizerRoutes);
    this.app.use(`/api/${config.apiVersion}/feed`, feedRoutes);
    this.app.use(`/api/${config.apiVersion}/admin`, adminRoutes);
    this.app.use(`/api/${config.apiVersion}/upload`, uploadRoutes);
    this.app.use(`/api/${config.apiVersion}/notifications`, notificationRoutes);
    this.app.use(`/api/${config.apiVersion}/quotas`, quotaRoutes);
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Initialize database
      await initializeDatabase();

      // Start server
      this.app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
        console.log(`Environment: ${config.nodeEnv}`);
        console.log(`API Version: ${config.apiVersion}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

export default App;