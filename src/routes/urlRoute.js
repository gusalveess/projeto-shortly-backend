import { Router } from "express";
import { Short, shortId, openShort, deleteUrl } from "../controllers/shortControllers.js";
import { Me, Ranking } from "../controllers/userControllers.js";
import { schemaValidationMiddleware } from "../middlewares/schemaMiddlewares.js";
import urlSchema from "../schemas/urlSchema.js";

const urlRoute = Router();

urlRoute.post("/urls/shorten", schemaValidationMiddleware(urlSchema), Short);
urlRoute.get("/urls/:id", shortId);
urlRoute.get("/urls/open/:shortUrl", openShort);
urlRoute.delete('/urls/:id', deleteUrl);
urlRoute.get("/users/me", Me);
urlRoute.get("/ranking", Ranking);

export default urlRoute;