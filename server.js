import express from "express";
import { userRoutes, heroRoutes } from "./routes/index.js";
import { ErrorController } from "./controllers/errorController.js";
import { LoggerMiddleware } from "./middleware/logger.js";
import { config } from "./config/config.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", config.paths.views);

app.use(LoggerMiddleware.logRequests);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(config.paths.public));

app.use(userRoutes);
app.use(heroRoutes);

app.use(LoggerMiddleware.logErrors);

app.use(ErrorController.handle404);

app.use(ErrorController.handleServerError);

app.listen(config.port, () => {
    console.log(`Serveur démarré sur http://localhost:${config.port}`);
});