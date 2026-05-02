import express from 'express';
import v1Router from './routes/v1.js';
import errorHandler, { AppError } from './middlewares/errorMiddleware.js';
import { loggerMiddleware } from './middlewares/loggerMiddleware.js';
import cookieParser from "cookie-parser"

const app = express();

// --- Global Middlewares ---
app.use(loggerMiddleware);
app.use(cookieParser());
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use('/rest/v1', v1Router);

// --- Error Handling ---
app.all('/{*any}', (req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// to catch all errors from the routes
app.use(errorHandler);

export default app;