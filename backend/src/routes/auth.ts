import { Router } from "express";
import { signUp, singIn } from "src/controllers/authController";
import { isAuth } from "src/middleware/auth";

const authRouter = Router();

authRouter.post("/signup", isAuth, signUp);
authRouter.get("/signin", singIn);

export default authRouter;
