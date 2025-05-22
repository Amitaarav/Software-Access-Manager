import 'reflect-metadata'
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { serverConfig, logger } from "./config/index.js";
import apiRoutes from "./routes/index.js";
import { AppDataSource } from "./database/data-source.js";

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});


async function startServer() {
  try {
    console.log("Initializing database...");
    await AppDataSource.initialize();
    console.log("DB initialized");
    logger.info("Database initialized successfully");

    const app = express();

    app.use(helmet());
    app.use(express.json());
    const allowedOrigins = [
      "http://localhost:3000",   // Local backend
      "http://localhost:5173",   // Local frontend (Vite)
      process.env.FRONTEND_URL,  // Production frontend URL
    ].filter(Boolean);

    app.use(
      cors({
        origin: (origin, callback) => {
          // Allow requests with no origin (like mobile apps, curl, Postman)
          if (!origin) return callback(null, true);
          
          if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
          }
          return callback(null, true);
        },
        credentials: true,
      })
    );
    app.post("/test", (req, res) => {
      console.log("Test route hit", req.body);
      res.status(200).json({ message: "Test route working", body: req.body });
    });
    
    app.use("/", apiRoutes);

    app.get("/", (_req, res) => {
      res.send("Server is up and running 🚀");
    });

    app.listen(serverConfig.PORT, () => {
      logger.info(`Server listening on port ${serverConfig.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    logger.error("Failed to start server", { error: err });
    process.exit(1);
  }
}

startServer();
