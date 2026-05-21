import { Annotation } from "@langchain/langgraph";

export const IncidentStateAnnotation = Annotation.Root({
    logs: Annotation<string[]>({
        default: () => [],
    }),

    parsedLogs: Annotation<string>({
        default: () => "",
    }),

    incidents: Annotation<string[]>({
        default: () => [],
    }),

    reasoning: Annotation<string>({
        default: () => "",
    }),

    fixPlan: Annotation<string>({
        default: () => "",
    }),

    report: Annotation<string>({
        default: () => "",
    }),
});

export type IncidentState = typeof IncidentStateAnnotation.State;