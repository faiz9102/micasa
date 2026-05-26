import express from 'express';
import cors from 'cors';
import v1Router from './routes/v1.js';
import errorHandler, { AppError } from './middlewares/errorMiddleware.js';
import { loggerMiddleware } from './middlewares/loggerMiddleware.js';
import cookieParser from "cookie-parser"

const app = express();

// --- Global Middlewares ---
app.use(loggerMiddleware);

const isDev = process.env.NODE_ENV !== "production";

app.use(
  cors({
    origin: isDev
      ? [/^http:\/\/localhost:\d+$/]
      : [
          "https://frontend.micasa.saqlainali.tech",
          "https://micasa-frontend-two.vercel.app",
        ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use('/rest/v1', v1Router);
app.use('/v1', v1Router);

// --- Error Handling ---
app.all('/{*any}', (req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// to catch all errors from the routes
app.use(errorHandler);

export default app;