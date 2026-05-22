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
import { deploymentResolverNode, k8sInspectionNode, selectPodNode } from "./k8sNode";

export async function buildIncidentGraph() {
  const workflow = new StateGraph(IncidentAnnotation)

    .addNode("parseLogs", parseLogsNode)

    .addNode("resolveDeployment", deploymentResolverNode)

    .addNode("selectPod", selectPodNode)

    // .addNode("fetchLogs", fetchLogsNode)

    .addNode("k8sInspection", k8sInspectionNode)

    .addNode("retrieveIncidents", retrieveIncidentsNode)

    .addNode("reasoning", reasoningNode)

    .addNode("fixPlanner", fixPlannerNode)

    .addNode("report", reportNode)

    .addEdge(START, "resolveDeployment")

    .addEdge("resolveDeployment", "selectPod")

    .addEdge("selectPod", "parseLogs")

    .addEdge("parseLogs", "k8sInspection")

    .addEdge("k8sInspection", "retrieveIncidents")

    .addEdge("retrieveIncidents", "reasoning")

    .addEdge("reasoning", "fixPlanner")

    .addEdge("fixPlanner", "report")

    .addEdge("report", END)

  return workflow.compile();
}