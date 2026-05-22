import type { Request, Response } from "express";
import { IncidentService } from "../services/incident.service";

export const analyzeIncident = async (req: Request, res: Response) => {
  try {
    const { namespace, service, podName, } = req.body;

    if (!namespace || !podName) {
      return res.status(400).json({ error: "logs and podName are required" });
    }

    const result = await IncidentService.analyze({
      namespace,
      service,
      podName,
    });

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};