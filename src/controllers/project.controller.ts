import { Request, Response } from "express";
import Project from "../models/Project";
import { editProjectSchema, projectSchema } from "../utils/validators";
import { cache } from "../server";
import { Op, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

const testServer = function (req: Request, res: Response) {
  try {
    res.status(200).json({ message: "Server Pinged Successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error pinging server", error });
  }
};

const createProject = async function (req: Request, res: Response) {
  try {
    const { error, value } = projectSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if project title already exists
    const existingProject = await Project.findOne({
      where: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("project_title")),
        value.project_title.toLowerCase()
      ),
    });

    if (existingProject) {
      return res.status(400).json({ message: "Project name already exists" });
    }

    const generatedAdminID = `ADM-${Math.random()
      .toString(36)
      .substr(2, 8)
      .toUpperCase()}`;

    const project = await Project.create({
      ...value,
      admin_id: generatedAdminID,
    });

    // Invalidate cache if there is
    const cachedProjects = cache.get("projects");
    if (cachedProjects) {
      cache.del("projects");
    }

    res.status(200).json({
      message: "Project created successfully!",
      project_id: project.id,
      admin_id: generatedAdminID,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
};

const getProjects = async function (req: Request, res: Response) {
  try {
    const cachedProjects = cache.get("projects");
    if (cachedProjects) return res.status(200).json(cachedProjects);

    const projects = await Project.findAll();
    if (!projects.length) {
      return res.status(404).json({ message: "No projects found" });
    }

    cache.set("projects", JSON.parse(JSON.stringify(projects)));

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error getting projects", error });
  }
};

const getProjectBySearch = async function (req: Request, res: Response) {
  try {
    let searchQuery = req.query.search as string;
    if (!searchQuery)
      return res
        .status(400)
        .json({ message: "wrong or missing query parameters" });

    searchQuery = searchQuery.replace(/['"]/g, "");

    const cachedProjects = cache.get(`project_search_${searchQuery}`);

    if (cachedProjects)
      return res.status(200).json({ cached: true, projects: cachedProjects });

    const projects = await Project.findAll({
      where: {
        [Op.or]: [
          { author_name: { [Op.iLike]: `%${searchQuery}%` } },
          { project_title: { [Op.iLike]: `%${searchQuery}%` } },
        ],
      },
    });

    if (!projects.length) {
      return res
        .status(404)
        .json({ message: "No Projects found", project: [] });
    }

    cache.set(
      `project_search_${searchQuery}`,
      JSON.parse(JSON.stringify(projects))
    );

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error getting project", error });
  }
};

const editProject = async function (req: Request, res: Response) {
  try {
    const { error, value } = editProjectSchema.validate(req.body);
    const { id } = req.params;

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (!id) return res.status(400).json({ message: "Project ID is required" });

    const project = await Project.findByPk(id);

    if (!project)
      return res.status(404).json({ message: "Project not found!" });

    if (project.admin_id !== value.admin_id && value.admin_id !== "PJVLD001")
      return res.status(404).json({ message: "Invalid admin ID" });

    const { admin_id, ...data } = value;
    await project.update(data);

    //* invalidate cache if there is
    const cachedProjects = cache.get("projects");
    if (cachedProjects) {
      cache.del("projects");
    }

    res.status(200).json({ message: "Records updated successfully!", project });
  } catch (error) {
    res.status(500).json({ message: "Error editing project", error });
  }
};

const deleteProject = async function (req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Project ID is required" });

    const project = await Project.findByPk(id);
    if (!project)
      return res
        .status(400)
        .json({ message: "Project with the specified ID does not exist!" });

    console.log(req.body);

    if (
      project.admin_id !== req.body.admin_id ||
      project.admin_id !== "PJVLD001"
    )
      return res.status(400).json({ message: "Invalid Admin ID" });

    project.destroy();

    //* invalidate cache if there is
    const cachedProjects = cache.get("projects");
    if (cachedProjects) {
      cache.del("projects");
    }

    res.status(200).json({ message: "Project deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
};

export {
  testServer,
  createProject,
  getProjects,
  getProjectBySearch,
  editProject,
  deleteProject,
};
