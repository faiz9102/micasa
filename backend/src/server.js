import 'dotenv/config';
import app from './app.js';
import AppDataSource from './configs/data-source.js';
const PORT = process.env.PORT || 3000;

let server;
let isShuttingDown = false;

const gracefulShutdown = (origin, error) => {
    if (isShuttingDown) {
        return;
    }

    isShuttingDown = true;
    if (error) {
        console.error(`❌ Fatal error from ${origin}:`, error);
    }

    if (server) {
        server.close(() => {
            if (AppDataSource.isInitialized) {
                AppDataSource.destroy().catch((dbError) => {
                    console.error('Error closing data source:', dbError);
                });
            }
            process.exit(error ? 1 : 0);
        });

        setTimeout(() => {
            console.error('❌ Forced shutdown after timeout.');
            process.exit(1);
        }, 10000).unref();

        return;
    }

    process.exit(error ? 1 : 0);
};

process.on('uncaughtException', (error) => {
    gracefulShutdown('uncaughtException', error);
});

process.on('unhandledRejection', (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    gracefulShutdown('unhandledRejection', error);
});

const startServer = async () => {
    try {
        // 1. Start Database Connection
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log('Data source initialized.');
        }

        // 2. Start Listening
        server = app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

        // 3. Handle Server Errors
        server.on('error', (error) => {
            gracefulShutdown('server', error);
        });
    } catch (error) {
        gracefulShutdown('startup', error);
    }
};

startServer();