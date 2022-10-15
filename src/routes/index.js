import { Router } from "express";
import signRouter from "./authRoute.js";
import urlRoute from "./urlRoute.js";

const router = Router();

router.use(signRouter);
router.use(urlRoute)

export default router;