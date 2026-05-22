import { Annotation } from "@langchain/langgraph";

export const IncidentStateAnnotation = Annotation.Root({
    logs: Annotation<string[]>({
        value: (x, y) => y,
        default: () => [],
    }),

    parsedLogs: Annotation<string>({
        value: (x, y) => y,
        default: () => "",
    }),

    incidents: Annotation<string[]>({
        value: (x, y) => y,
        default: () => [],
    }),

    reasoning: Annotation<string>({
        value: (x, y) => y,
        default: () => "",
    }),

    fixPlan: Annotation<string>({
        value: (x, y) => y,
        default: () => "",
    }),

    report: Annotation<string>({
        value: (x, y) => y,
        default: () => "",
    }),

    podName: Annotation<string>({
        value: (x, y) => y,
        default: () => "",
    }),

    namespace: Annotation<string>({
        value: (x, y) => y,
        default: () => "default",
    }),
});

export type IncidentState = typeof IncidentStateAnnotation.State;