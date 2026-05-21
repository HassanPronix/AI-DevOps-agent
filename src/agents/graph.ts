import { START, END, StateGraph } from "@langchain/langgraph";

import { IncidentAnnotation } from "../types/incident";

import {
  parseLogsNode,
  retrieveIncidentsNode,
  reasoningNode,
  fixPlannerNode,
  reportNode,
} from "./nodes";

export async function buildIncidentGraph() {
  const workflow = new StateGraph(IncidentAnnotation)

    .addNode("parseLogs", parseLogsNode)

    .addNode("retrieveIncidents", retrieveIncidentsNode)

    .addNode("reasoning", reasoningNode)

    .addNode("fixPlanner", fixPlannerNode)

    .addNode("report", reportNode)

    .addEdge(START, "parseLogs")

    .addEdge("parseLogs", "retrieveIncidents")

    .addEdge("retrieveIncidents", "reasoning")

    .addEdge("reasoning", "fixPlanner")

    .addEdge("fixPlanner", "report")

    .addEdge("report", END);

  return workflow.compile();
}