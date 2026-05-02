import express from "express";
import accountRoutes from "./accountRoute.js";
import authRoutes from "./authRoute.js";
import propertyRoutes from "./propertyRoute.js";
import { authAccessMiddleware } from "../middlewares/authMiddleware.js";

const v1Router = express.Router();

v1Router.use(authAccessMiddleware);

v1Router.use('/', authRoutes);
v1Router.use("/account", accountRoutes);
v1Router.use("/properties", propertyRoutes);

export default v1Router;
