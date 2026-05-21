import express from "express";
import cors from "cors";
import incidentRoutes from "./routes/incident.routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/incident", incidentRoutes);

export default app;