import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

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

        console.log(` QR code généré pour ${user.name}: ${qrCodePath}`);
        return `/qr-code/user-${user.id}.png`;
    } catch (error) {
        console.error(` Erreur génération QR code pour ${user.name}:`, error);
        return null;
    }
}

async function generateAllQRCodes() {
    try {
        const usersPath = path.join(__dirname, "users.json");
        const data = fs.readFileSync(usersPath, "utf-8");
        const users = JSON.parse(data);

        console.log(` Génération des QR codes pour ${users.length} utilisateurs...\n`);

        for (const user of users) {
            await generateQRCode(user);
        }

        console.log("\n Tous les QR codes ont été générés avec succès !");
    } catch (error) {
        console.error(" Erreur lors de la génération des QR codes:", error);
    }
}

generateAllQRCodes();