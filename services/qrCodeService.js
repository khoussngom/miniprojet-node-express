import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { config } from "../config/config.js";

export class QRCodeService {

    static async generateQRCode(user) {
        try {

            if (!fs.existsSync(config.paths.uploads)) {
                fs.mkdirSync(config.paths.uploads, { recursive: true });
            }

            const qrCodePath = path.join(config.paths.uploads, `user-${user.id}.png`);
            const qrData = `Nom: ${user.name}\nÂge: ${user.age}\nGitHub: ${user.github}\nEmail: ${user.email}`;

            await QRCode.toFile(qrCodePath, qrData, config.qrCode);

            return `/qr-code/user-${user.id}.png`;
        } catch (error) {
            console.error("Erreur génération QR code:", error);
            return null;
        }
    }


    static getQRCodePath(userId) {
        const qrCodePath = path.join(config.paths.uploads, `user-${userId}.png`);

        if (fs.existsSync(qrCodePath)) {
            return `/qr-code/user-${userId}.png`;
        }

        return null;
    }

    static deleteQRCode(userId) {
        try {
            const qrCodePath = path.join(config.paths.uploads, `user-${userId}.png`);

            if (fs.existsSync(qrCodePath)) {
                fs.unlinkSync(qrCodePath);
                return true;
            }

            return true;
        } catch (error) {
            console.error("Erreur suppression QR code:", error);
            return false;
        }
    }
}