import { Router } from 'express';
import authRoutes from "./auth-routes.js";
import userRoutes from "./user-routes.js";
import softwareRoutes from "./software-routes.js";
import requestRoutes from "./request-routes.js";

const v1Router = Router();

v1Router.use('/auth', authRoutes);
v1Router.use('/users', userRoutes);
v1Router.use('/software', softwareRoutes);
v1Router.use('/requests', requestRoutes);

export default v1Router;