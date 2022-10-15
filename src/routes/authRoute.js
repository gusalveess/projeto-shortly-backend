import { Router } from "express";
import { SignUp } from "../controllers/signupControllers.js";
import { SignIn } from "../controllers/signinControllers.js";
import { schemaValidationMiddleware } from "../middlewares/schemaMiddlewares.js";
import signupSchema from '../schemas/signupSchema.js';
import signinSchema from '../schemas/signinSchema.js';

const signRouter = Router();

signRouter.post("/signUp", schemaValidationMiddleware(signupSchema), SignUp);
signRouter.post("/signIn", schemaValidationMiddleware(signinSchema), SignIn);

export default signRouter;
