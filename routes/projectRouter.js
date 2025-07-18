import express from "express";
import multer from "multer";

import {
  createProject,
  deleteProject,
  getAllProjects,
  updateProject,
} from "../controllers/projectController.js";
import { protectRoute } from "../middleware/uthMiddleware.js";

const projectRouter = express.Router();

// Set up multer for handling multiple file fields
const upload = multer({ dest: "uploads/" });

projectRouter.get("/", getAllProjects);

projectRouter.post(
  "/",
  protectRoute,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "screenshots", maxCount: 10 },
  ]),
  createProject
);
projectRouter.put(
  "/:id",
  protectRoute,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "screenshots", maxCount: 10 },
  ]),
  updateProject
);
projectRouter.delete("/:id", protectRoute, deleteProject);

export default projectRouter;
