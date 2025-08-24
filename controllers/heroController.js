import { HeroService } from "../services/heroService.js";

export class HeroController {

    static showRandomHero(req, res) {
        try {
            const randomHero = HeroService.getRandomHero();
            res.render("random-hero", { hero: randomHero });
        } catch (error) {
            console.error("Erreur génération héros aléatoire:", error);
            res.status(500).render("error", {
                message: "Erreur lors de la génération du super-héros"
            });
        }
    }


    static searchHeroes(req, res) {
        try {
            const query = req.query.q || "";
            const results = HeroService.searchHeroes(query);

            res.json({
                query,
                results,
                total: results.length
            });
        } catch (error) {
            console.error("Erreur recherche héros:", error);
            res.status(500).json({
                error: "Erreur lors de la recherche de super-héros"
            });
        }
    }
}