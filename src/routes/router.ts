import { Router } from "express";
import { createProject, deleteProject, editProject, getProjectBySearch, getProjects, testServer } from "../controllers/project.controller";

const router = Router();

router.get("/", testServer);
router.post("/create", createProject);
router.get("/projects", getProjects);
router.get("/q", getProjectBySearch);
router.patch("/update/:id", editProject);
router.delete("/delete/:id", deleteProject);

export { router };
