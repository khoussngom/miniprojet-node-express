import { UserService } from "../services/userService.js";
import { QRCodeService } from "../services/qrCodeService.js";

export class UserController {
    /**
     * Affiche la page d'accueil
     */
    static showHome(req, res) {
        res.render("index");
    }

    /**
     * Affiche la liste de tous les utilisateurs
     */
    static showUsers(req, res) {
        try {
            const users = UserService.getUsers();
            console.log("Rendering users page with:", users.length, "users");
            res.render("users", { users });
        } catch (error) {
            console.error("Erreur affichage utilisateurs:", error);
            res.status(500).render("error", {
                message: "Erreur lors du chargement des utilisateurs"
            });
        }
    }

    /**
     * Affiche le formulaire d'ajout d'utilisateur
     */
    static showAddUserForm(req, res) {
        res.render("add-user");
    }

    /**
     * Traite l'ajout d'un nouvel utilisateur
     */
    static async addUser(req, res) {
        try {
            const userData = req.body;

            // Validation des données
            const validation = UserService.validateUser(userData);
            if (!validation.isValid) {
                return res.status(400).render("add-user", {
                    error: validation.errors.join(", "),
                    formData: userData
                });
            }

            // Ajout de l'utilisateur
            const newUser = UserService.addUser(userData);
            if (!newUser) {
                return res.status(500).render("add-user", {
                    error: "Erreur lors de la sauvegarde de l'utilisateur",
                    formData: userData
                });
            }

            // Génération du QR code
            const qrCodePath = await QRCodeService.generateQRCode(newUser);
            if (qrCodePath) {
                // Mettre à jour l'utilisateur avec le chemin du QR code
                const users = UserService.getUsers();
                const userIndex = users.findIndex(u => u.id === newUser.id);
                if (userIndex !== -1) {
                    users[userIndex].qrcode = qrCodePath;
                    UserService.saveUsers(users);
                }
            }

            res.redirect("/users");
        } catch (error) {
            console.error("Erreur ajout utilisateur:", error);
            res.status(500).render("add-user", {
                error: "Erreur serveur lors de l'ajout de l'utilisateur",
                formData: req.body
            });
        }
    }

    /**
     * Affiche les détails d'un utilisateur
     */
    static showUserDetails(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const user = UserService.getUserById(userId);

            if (!user) {
                return res.status(404).render("404", {
                    message: "Utilisateur non trouvé"
                });
            }

            // Vérifier si le QR code existe
            const qrCodePath = QRCodeService.getQRCodePath(user.id);
            if (qrCodePath) {
                user.qrcode = qrCodePath;
            }

            res.render("user-details", { user });
        } catch (error) {
            console.error("Erreur affichage détails utilisateur:", error);
            res.status(500).render("error", {
                message: "Erreur lors du chargement des détails de l'utilisateur"
            });
        }
    }

    /**
     * Recherche des utilisateurs
     */
    static searchUsers(req, res) {
        try {
            const query = req.query.q || "";
            const results = UserService.searchUsers(query);

            res.render("search-results", {
                results,
                query
            });
        } catch (error) {
            console.error("Erreur recherche utilisateurs:", error);
            res.status(500).render("error", {
                message: "Erreur lors de la recherche"
            });
        }
    }
}