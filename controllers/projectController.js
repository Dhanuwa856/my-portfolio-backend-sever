import Project from "../models/Project.js";
import { uploadFileToSupabase } from "../utils/uploadToSupabase.js";

// @desc Add new project

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      demoUrl,
      githubUrl,
      tags,
      screenshots, // fallback if user gives URLs directly
    } = req.body;

    // 1. Upload main image
    const mainImageUrl = await uploadFileToSupabase(
      req.files.mainImage[0],
      "projects"
    );

    // 2. Upload screenshots (array of files)
    const screenshotUrls = [];
    if (req.files.screenshots) {
      for (const file of req.files.screenshots) {
        const url = await uploadFileToSupabase(file, "screenshots");
        screenshotUrls.push(url);
      }
    }

    const project = await Project.create({
      title,
      description,
      demoUrl,
      githubUrl,
      tags: JSON.parse(tags),
      screenshots:
        screenshotUrls.length > 0
          ? screenshotUrls
          : JSON.parse(screenshots || "[]"),
      mainImage: mainImageUrl,
    });

    res.status(201).json({ message: "Project created", project });
  } catch (err) {
    console.error("Project upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

// @desc Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
