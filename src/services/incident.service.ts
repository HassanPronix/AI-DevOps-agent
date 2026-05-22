// type IncidentInput = {
//   logs: string;
//   service?: string;
// };

// export class IncidentService {

//   static async analyze(input: IncidentInput) {
//     const { logs, service } = input;

//     // 🔹 Step 1: pretend log parsing agent
//     const parsedLogs = this.parseLogs(logs);

//     // 🔹 Step 2: pretend retrieval agent
//     const similarIncidents = this.mockRetrieve(parsedLogs);

//     // 🔹 Step 3: pretend reasoning agent
//     const hypothesis = this.mockReasoning(parsedLogs, similarIncidents);

//     // 🔹 Step 4: fix planner
//     const fixPlan = this.mockFixPlan(hypothesis);

//     return {
//       service: service || "unknown",
//       parsedLogs,
//       similarIncidents,
//       hypothesis,
//       fixPlan,
//       risk: "low",
//       timestamp: new Date().toISOString(),
//     };
//   }

//   static parseLogs(logs: string) {
//     return {
//       errorLines: logs.split("\n").filter((l) => l.includes("error")),
//       summary: logs.slice(0, 100),
//     };
//   }

//   static mockRetrieve(parsedLogs: any) {
//     return [
//       {
//         incident: "CrashLoopBackOff in auth-service",
//         similarity: 0.87,
//       },
//     ];
//   }

//   static mockReasoning(parsedLogs: any, retrieved: any) {
//     return [
//       "Possible memory leak in container",
//       "Or misconfigured environment variables",
//     ];
//   }

//   static mockFixPlan(hypothesis: any) {
//     return [
//       "Check pod memory limits",
//       "Restart deployment",
//       "Verify env configs",
//     ];
//   }
// }

import { buildIncidentGraph } from "../agents/graph";
import { storeIncident } from "../db/storeIncident";

type IncidentInput = {
  namespace?: string;
  service?: string;
  podName?: string;
};
export class IncidentService {

  static async analyze(input: IncidentInput) {

    const graph = await buildIncidentGraph();

    const result = await graph.invoke({
      namespace: input.service,
      service: input.service,
      podName: input.podName
    });

    await storeIncident({
      logs: result.logs,
      service: result.service,
      hypotheses: result.hypotheses,
      fixPlan: result.fixPlan,
    });

    return result;
  }
}
