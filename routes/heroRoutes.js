import express from "express";
import { HeroController } from "../controllers/heroController.js";

const router = express.Router();

// Route pour afficher un héros aléatoire
router.get("/random-hero", HeroController.showRandomHero);

// Route pour la recherche de héros (API)
router.get("/api/heroes/search", HeroController.searchHeroes);

export default router;