import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";
import superheroes from "superheroes";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3100;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const usersPath = path.join(__dirname, "users.json");

function getUsers() {
    try {
        const data = fs.readFileSync(usersPath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Erreur lecture users.json:", error);
        return [];
    }
}

function saveUsers(users) {
    try {
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error("Erreur écriture users.json:", error);
        return false;
    }
}

async function generateQRCode(user) {
    try {
        const qrCodePath = path.join(__dirname, "public", "qr-code", `user-${user.id}.png`);
        const qrData = `Nom: ${user.name}\nÂge: ${user.age}\nGitHub: ${user.github}\nEmail: ${user.email}`;

        await QRCode.toFile(qrCodePath, qrData, {
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: 300
        });

        return `/qr-code/user-${user.id}.png`;
    } catch (error) {
        console.error("Erreur génération QR code:", error);
        return null;
    }
}

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/users", (req, res) => {
    const users = getUsers();
    console.log("Rendering users page with:", users.length, "users");
    res.render("users", { users });
});

app.get("/users/search", (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.render("search-results", { results: [], query: "" });
    }

    const users = getUsers();
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase())
    );

    res.render("search-results", { results: filteredUsers, query });
});

app.get("/add-user", (req, res) => {
    res.render("add-user");
});

app.post("/add-user", async(req, res) => {
    try {
        const { name, age, github, email } = req.body;

        if (!name || !age || !github || !email) {
            return res.status(400).render("add-user", {
                error: "Tous les champs sont obligatoires"
            });
        }

        const users = getUsers();
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

        const newUser = {
            id: newId,
            name: name.trim(),
            age: parseInt(age),
            github: github.trim(),
            email: email.trim()
        };

        const qrCodePath = await generateQRCode(newUser);
        if (qrCodePath) {
            newUser.qrcode = qrCodePath;
        }

        users.push(newUser);

        if (saveUsers(users)) {
            res.redirect("/users");
        } else {
            res.status(500).render("add-user", {
                error: "Erreur lors de la sauvegarde"
            });
        }
    } catch (error) {
        console.error("Erreur ajout utilisateur:", error);
        res.status(500).render("add-user", {
            error: "Erreur serveur"
        });
    }
});

app.get("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const users = getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).render("404", {
            message: "Utilisateur non trouvé"
        });
    }

    const qrCodePath = path.join(__dirname, "public", "qr-code", `user-${user.id}.png`);
    if (fs.existsSync(qrCodePath)) {
        user.qrcode = `/qr-code/user-${user.id}.png`;
    }

    res.render("user-details", { user });
});

app.get("/random-hero", (req, res) => {
    const randomHero = superheroes.random();
    res.render("random-hero", { hero: randomHero });
});

app.use((req, res) => {
    res.status(404).render("404", {
        message: "Page non trouvée"
    });
});

app.use((err, req, res, next) => {
    console.error("Erreur serveur:", err.stack);
    res.status(500).render("error", {
        message: "Erreur interne du serveur"
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});


console.log(getUsers())