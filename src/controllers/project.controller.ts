import { Request, Response } from "express";
import Project from "../models/Project";
import { editProjectSchema, projectSchema } from "../utils/validators";
import { cache } from "../server";
import { Op } from "sequelize";

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

    const project = await Project.create(value);

    //* invalidate cache if there is
    const cachedProjects = cache.get("projects");
    if (cachedProjects) {
      cache.del("projects");
    }

    res.status(200).json({ message: "Project created successfully!", project_id: project.id });
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
    const searchQuery = req.query.search as string;
    if (!searchQuery) return res.status(400).json({ message: "wrong or missing query parameters" });

    const cachedProjects = cache.get(`project_search_${searchQuery}`);

    if (cachedProjects) return res.status(200).json({ cached: true, projects: cachedProjects });

    const projects = await Project.findAll({
      where: {
        [Op.or]: [{ author_name: { [Op.iLike]: `%${searchQuery}%` } }, { project_title: { [Op.iLike]: `%${searchQuery}%` } }],
      },
    });

    if (!projects.length) {
      return res.status(404).json({ message: "No Projects found", project: [] });
    }

    cache.set(`project_search_${searchQuery}`, JSON.parse(JSON.stringify(projects)));

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
    if (!project) return res.status(404).json({ message: "Project not found!" });

    await project.update(value);

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
    if (!project) return res.status(400).json({ message: "Project with the specified ID does not exist!" });

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

export { testServer, createProject, getProjects, getProjectBySearch, editProject, deleteProject };
