import fs from "fs";
import { config } from "../config/config.js";

export class UserService {

    static getUsers() {
        try {
            const data = fs.readFileSync(config.paths.users, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error("Erreur lecture users.json:", error);
            return [];
        }
    }


    static saveUsers(users) {
        try {
            fs.writeFileSync(config.paths.users, JSON.stringify(users, null, 2));
            return true;
        } catch (error) {
            console.error("Erreur écriture users.json:", error);
            return false;
        }
    }


    static getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === parseInt(id)) || null;
    }


    static searchUsers(query) {
        if (!query) return [];

        const users = this.getUsers();
        return users.filter(user =>
            user.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    static addUser(userData) {
        try {
            const users = this.getUsers();
            const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

            const newUser = {
                id: newId,
                name: userData.name.trim(),
                age: parseInt(userData.age),
                github: userData.github.trim(),
                email: userData.email.trim()
            };

            users.push(newUser);

            if (this.saveUsers(users)) {
                return newUser;
            }
            return null;
        } catch (error) {
            console.error("Erreur ajout utilisateur:", error);
            return null;
        }
    }


    static validateUser(userData) {
        const errors = [];

        if (!userData.name || userData.name.trim() === '') {
            errors.push('Le nom est obligatoire');
        }

        if (!userData.age || isNaN(parseInt(userData.age)) || parseInt(userData.age) <= 0) {
            errors.push('L\'âge doit être un nombre positif');
        }

        if (!userData.github || userData.github.trim() === '') {
            errors.push('Le lien GitHub est obligatoire');
        }

        if (!userData.email || userData.email.trim() === '') {
            errors.push('L\'email est obligatoire');
        } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
            errors.push('L\'email n\'est pas valide');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}