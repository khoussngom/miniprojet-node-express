import express from "express";
import { HeroController } from "../controllers/heroController.js";

const router = express.Router();

router.get("/random-hero", HeroController.showRandomHero);

router.get("/api/heroes/search", HeroController.searchHeroes);

export default router;