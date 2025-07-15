import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

import { protectRoute } from "../middleware/uthMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser); // Optional - for setup
userRouter.post("/login", loginUser);
userRouter.get("/profile", protectRoute, getUserProfile);
userRouter.put("/profile", protectRoute, updateUserProfile);

export default userRouter;
