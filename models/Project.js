import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    demoUrl: String,
    githubUrl: String,
    tags: [String],
    mainImage: { type: String, required: true },
    screenshots: [String],
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("ProjectDB", projectSchema);
export default Project;
