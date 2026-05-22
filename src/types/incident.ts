import { Annotation } from "@langchain/langgraph";

export const IncidentAnnotation = Annotation.Root({
  logs: Annotation<string>(),

  service: Annotation<string | undefined>(),

  parsedLogs: Annotation<any>(),

  retrievedIncidents: Annotation<any[]>({
    reducer: (x, y) => [...x, ...y],
    default: () => [],
  }),

  hypotheses: Annotation<string[]>({
    reducer: (x, y) => [...x, ...y],
    default: () => [],
  }),

  fixPlan: Annotation<string[]>({
    reducer: (x, y) => [...x, ...y],
    default: () => [],
  }),

  finalReport: Annotation<string>(),

  clusterContext: Annotation<any>(),

  podName: Annotation<string>(),

  namespace: Annotation<string>(),

  deployment: Annotation<string>(),

  resolvedPods: Annotation<{ name: string; status?: string; restarts?: number; }[]>({
    value: (_prev, next) => next,
    default: () => [],
  }),

});

export type IncidentState = typeof IncidentAnnotation.State;