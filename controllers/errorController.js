export class ErrorController {

    static handle404(req, res) {
        res.status(404).render("404", {
            message: "Page non trouvée",
            url: req.originalUrl
        });
    }


    static handleServerError(err, req, res, next) {
        console.error("Erreur serveur:", err.stack);

        const isDevelopment = process.env.NODE_ENV !== 'production';

        res.status(500).render("error", {
            message: "Erreur interne du serveur",
            error: isDevelopment ? err : {},
            stack: isDevelopment ? err.stack : ""
        });
    }


    static handleCustomError(statusCode, message) {
        return (req, res) => {
            res.status(statusCode).render("error", {
                message: message || "Une erreur est survenue"
            });
        };
    }
}