export class LoggerMiddleware {

    static logRequests(req, res, next) {
        const timestamp = new Date().toISOString();
        const method = req.method;
        const url = req.originalUrl;
        const userAgent = req.get('User-Agent') || 'Unknown';

        console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);

        const startTime = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - startTime;
            const statusCode = res.statusCode;
            console.log(`[${timestamp}] ${method} ${url} - ${statusCode} - ${duration}ms`);
        });

        next();
    }

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