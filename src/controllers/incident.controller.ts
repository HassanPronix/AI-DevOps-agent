import type { Request, Response } from "express";
import { IncidentService } from "../services/incident.service";

export const analyzeIncident = async (req: Request, res: Response) => {
  try {
    const { service, deployment, namespace, } = req.body;

    if (!namespace || !deployment) {
      return res.status(400).json({ error: "deployemnt and namespace are required" });
    }

    const result = await IncidentService.analyze({
      service,
      deployment,
      namespace,
    });

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};