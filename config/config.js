import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname); // Remonte d'un niveau pour aller à la racine

export const config = {
    // Serveur
    port: process.env.PORT || 3100,
    nodeEnv: process.env.NODE_ENV || 'development',

    // Chemins
    paths: {
        root: rootDir,
        views: path.join(rootDir, "views"),
        public: path.join(rootDir, "public"),
        uploads: path.join(rootDir, "public", "qr-code"),
        users: path.join(rootDir, "users.json")
    },

    // QR Code
    qrCode: {
        width: 300,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    },

    // Messages d'erreur
    messages: {
        userNotFound: "Utilisateur non trouvé",
        pageNotFound: "Page non trouvée",
        serverError: "Erreur interne du serveur",
        validationError: "Données invalides",
        saveError: "Erreur lors de la sauvegarde"
    }
};