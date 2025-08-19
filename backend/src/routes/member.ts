import { Router } from "express";
import { createMember, getMembers } from "src/controllers/memberConstroller";
import { isAuth } from "src/middleware/auth";

const memberRouter = Router();

memberRouter.post("/", createMember);
memberRouter.get("/", isAuth, getMembers);

export default memberRouter;
