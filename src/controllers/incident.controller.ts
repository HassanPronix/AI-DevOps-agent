import type { Request, Response } from "express";
import { IncidentService } from "../services/incident.service";

export const analyzeIncident = async (req: Request, res: Response) => {
  try {
    const { logs, service } = req.body;

    if (!logs) {
      return res.status(400).json({ error: "logs are required" });
    }

    const result = await IncidentService.analyze({
      logs,
      service,
    });

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};