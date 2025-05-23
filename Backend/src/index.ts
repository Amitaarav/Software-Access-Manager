import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/config.js";
import routes from "./routes/index.js";
import { initializeDataSource } from "./database/data-source.js";

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
}));
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api", routes);

// Health check endpoint
app.get("/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDataSource();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
