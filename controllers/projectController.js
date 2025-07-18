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
      category,
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
      category,
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

// @desc Update project
export const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const existingProject = await Project.findById(projectId);

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Start building updated fields, falling back to existing values
    const updatedFields = {
      title: req.body.title || existingProject.title,
      description: req.body.description || existingProject.description,
      demoUrl: req.body.demoUrl || existingProject.demoUrl,
      githubUrl: req.body.githubUrl || existingProject.githubUrl,
      tags: req.body.tags ? JSON.parse(req.body.tags) : existingProject.tags,
      category: req.body.category || existingProject.category,
      mainImage: existingProject.mainImage,
      screenshots: existingProject.screenshots,
      pdfUrls: existingProject.pdfUrls,
    };

    // Upload new main image if provided
    if (req.files?.mainImage?.[0]) {
      const imageFile = req.files.mainImage[0];
      const { data, error } = await supabase.storage
        .from("projects")
        .upload(
          `main_${Date.now()}_${imageFile.originalname}`,
          imageFile.buffer,
          {
            contentType: imageFile.mimetype,
          }
        );
      if (error) throw error;
      updatedFields.mainImage = `${process.env.SUPABASE_URL}/storage/v1/object/public/projects/${data.path}`;
    }

    // Upload new screenshots if provided
    if (req.files?.screenshots?.length) {
      const screenshots = [];
      for (const file of req.files.screenshots) {
        const { data, error } = await supabase.storage
          .from("screenshots")
          .upload(`ss_${Date.now()}_${file.originalname}`, file.buffer, {
            contentType: file.mimetype,
          });
        if (error) throw error;
        screenshots.push(
          `${process.env.SUPABASE_URL}/storage/v1/object/public/screenshots/${data.path}`
        );
      }
      updatedFields.screenshots = screenshots;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updatedFields,
      {
        new: true,
      }
    );

    res.json({ message: "Project updated", project: updatedProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update project" });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete project" });
  }
};
