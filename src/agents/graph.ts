import { START, END, StateGraph } from "@langchain/langgraph";

import { IncidentAnnotation } from "../types/incident";

import {
  parseLogsNode,
  retrieveIncidentsNode,
  reasoningNode,
  fixPlannerNode,
  reportNode,
  fetchLogsNode,
} from "./nodes";
import { k8sInspectionNode } from "./k8sNode";

export async function buildIncidentGraph() {
  const workflow = new StateGraph(IncidentAnnotation)

    .addNode("parseLogs", parseLogsNode)

    .addNode("fetchLogs", fetchLogsNode)

    .addNode("k8sInspection", k8sInspectionNode)

    .addNode("retrieveIncidents", retrieveIncidentsNode)

    .addNode("reasoning", reasoningNode)

    .addNode("fixPlanner", fixPlannerNode)

    .addNode("report", reportNode)

    .addEdge(START, "fetchLogs")

    .addEdge("fetchLogs", "parseLogs")

    .addEdge("parseLogs", "k8sInspection")

    .addEdge("k8sInspection", "retrieveIncidents")

    .addEdge("retrieveIncidents", "reasoning")

    .addEdge("reasoning", "fixPlanner")

    .addEdge("fixPlanner", "report")

    .addEdge("report", END);

  return workflow.compile();
}