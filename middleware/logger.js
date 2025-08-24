export class LoggerMiddleware {
    /**
     * Middleware de logging des requêtes
     */
    static logRequests(req, res, next) {
        const timestamp = new Date().toISOString();
        const method = req.method;
        const url = req.originalUrl;
        const userAgent = req.get('User-Agent') || 'Unknown';

        console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);

        // Log du temps de réponse
        const startTime = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - startTime;
            const statusCode = res.statusCode;
            console.log(`[${timestamp}] ${method} ${url} - ${statusCode} - ${duration}ms`);
        });

        next();
    }

    /**
     * Middleware de logging des erreurs
     */
    static logErrors(err, req, res, next) {
        const timestamp = new Date().toISOString();
        const method = req.method;
        const url = req.originalUrl;

        console.error(`[${timestamp}] ERROR - ${method} ${url}`);
        console.error(`Message: ${err.message}`);
        console.error(`Stack: ${err.stack}`);

        next(err);
    }
}