export class ErrorController {
    /**
     * Gère les erreurs 404 (page non trouvée)
     */
    static handle404(req, res) {
        res.status(404).render("404", {
            message: "Page non trouvée",
            url: req.originalUrl
        });
    }

    /**
     * Gère les erreurs serveur (500)
     */
    static handleServerError(err, req, res, next) {
        console.error("Erreur serveur:", err.stack);

        // En mode développement, on peut afficher plus de détails
        const isDevelopment = process.env.NODE_ENV !== 'production';

        res.status(500).render("error", {
            message: "Erreur interne du serveur",
            error: isDevelopment ? err : {},
            stack: isDevelopment ? err.stack : ""
        });
    }

    /**
     * Gère les erreurs personnalisées
     */
    static handleCustomError(statusCode, message) {
        return (req, res) => {
            res.status(statusCode).render("error", {
                message: message || "Une erreur est survenue"
            });
        };
    }
}