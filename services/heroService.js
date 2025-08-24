import superheroes from "superheroes";

export class HeroService {

    static getRandomHero() {
        return superheroes.random();
    }

    static getAllHeroes() {
        return superheroes.all;
    }


    static searchHeroes(query) {
        if (!query) return [];

        return superheroes.all.filter(hero =>
            hero.toLowerCase().includes(query.toLowerCase())
        );
    }
}