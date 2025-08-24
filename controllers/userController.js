import { UserService } from "../services/userService.js";
import { QRCodeService } from "../services/qrCodeService.js";

export class UserController {

    static showHome(req, res) {
        res.render("index");
    }

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


    static showAddUserForm(req, res) {
        res.render("add-user");
    }


    static async addUser(req, res) {
        try {
            const userData = req.body;

            const validation = UserService.validateUser(userData);
            if (!validation.isValid) {
                return res.status(400).render("add-user", {
                    error: validation.errors.join(", "),
                    formData: userData
                });
            }

            const newUser = UserService.addUser(userData);
            if (!newUser) {
                return res.status(500).render("add-user", {
                    error: "Erreur lors de la sauvegarde de l'utilisateur",
                    formData: userData
                });
            }


            const qrCodePath = await QRCodeService.generateQRCode(newUser);
            if (qrCodePath) {

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


    static showUserDetails(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const user = UserService.getUserById(userId);

            if (!user) {
                return res.status(404).render("404", {
                    message: "Utilisateur non trouvé"
                });
            }


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