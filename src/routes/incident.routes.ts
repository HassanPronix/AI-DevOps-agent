import { Router } from "express";
import { analyzeIncident } from "../controllers/incident.controller";

const router = Router();

router.post("/analyze", analyzeIncident);

export default router;