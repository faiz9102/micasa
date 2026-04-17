/**
 * Custom Error Class to handle operational errors
 */
export class AppError extends Error {
    statusCode;
    isOperational;

    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Global Error Handling Middleware
 */
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }

    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
};

export const errorHandler = (err, req, res, _next) => {
    err.statusCode = err.statusCode || 500;
    err.status = `${err.statusCode}`.startsWith('4') ? 'fail' : 'error';

    console.error('ERROR: ', err);

    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, res);
    }

    return sendErrorProd(err, res);
};

export default errorHandler;