export class ValidationMiddleware {
    static validateUserInput(req, res, next) {
        const { name, age, github, email } = req.body;
        const errors = [];

        if (!name || name.trim() === '') {
            errors.push('Le nom est obligatoire');
        } else if (name.length < 2) {
            errors.push('Le nom doit contenir au moins 2 caractères');
        } else if (name.length > 50) {
            errors.push('Le nom ne peut pas dépasser 50 caractères');
        }

        if (!age) {
            errors.push('L\'âge est obligatoire');
        } else {
            const ageNum = parseInt(age);
            if (isNaN(ageNum) || ageNum <= 0) {
                errors.push('L\'âge doit être un nombre positif');
            } else if (ageNum > 150) {
                errors.push('L\'âge ne peut pas dépasser 150 ans');
            }
        }

        if (!github || github.trim() === '') {
            errors.push('Le lien GitHub est obligatoire');
        } else {
            const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9._-]+\/?$/;
            if (!githubRegex.test(github.trim())) {
                errors.push('Le lien GitHub n\'est pas valide');
            }
        }

        if (!email || email.trim() === '') {
            errors.push('L\'email est obligatoire');
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim())) {
                errors.push('L\'email n\'est pas valide');
            }
        }

        if (errors.length > 0) {
            return res.status(400).render("add-user", {
                error: errors.join(", "),
                formData: req.body
            });
        }

        req.body = {
            name: name.trim(),
            age: parseInt(age),
            github: github.trim(),
            email: email.trim().toLowerCase()
        };

        next();
    }

    static validateUserId(req, res, next) {
        const userId = parseInt(req.params.id);

        if (isNaN(userId) || userId <= 0) {
            return res.status(400).render("404", {
                message: "ID utilisateur invalide"
            });
        }

        req.params.id = userId;
        next();
    }


    static validateSearchQuery(req, res, next) {
        const query = req.query.q;

        if (query && query.length > 100) {
            return res.status(400).json({
                error: "La requête de recherche ne peut pas dépasser 100 caractères"
            });
        }

        next();
    }
}