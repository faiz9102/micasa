import express from 'express';
import errorHandler, { AppError } from './middlewares/error.js';

const app = express();

// --- Global Middlewares ---
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true }));

// --- Error Handling ---
app.use((req, res, next) => {
	next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// This must be the last middleware to catch all errors from the routes
app.use(errorHandler);

export default app;