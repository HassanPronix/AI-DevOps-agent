import type { IncidentState } from "../types/incident";
import { llm } from "./llm";
import { embeddings } from "../db/embeddings";
import { getIncidentCollection } from "../db/incidentCollection";
import { getPodLogs } from "../k8s/tools";

export async function parseLogsNode(state: IncidentState) {
    const errorLines = state.logs
        .split("\n")
        .filter((line) => line.toLowerCase().includes("error"));

    return {
        parsedLogs: {
            summary: state.logs.slice(0, 200),
            errorLines,
        },
    };
}

// export async function retrieveIncidentsNode(state: IncidentState) {
//     const collection = await getIncidentCollection();

//     const queryEmbedding = await embeddings.embedQuery(state.logs);

//     const results = await collection.query({
//         queryEmbeddings: [queryEmbedding],
//         nResults: 3,
//     });

//     const incidents =
//         results.documents?.[0]?.map((doc, idx) => ({
//             log: doc,
//             metadata: results.metadatas?.[0]?.[idx],
//         })) || [];

//     return {
//         retrievedIncidents: incidents,
//     };
// }

export async function retrieveIncidentsNode(state: IncidentState) {
    const collection =
        await getIncidentCollection();

    const queryEmbedding =
        await embeddings.embedQuery(state.logs);

    const results =
        await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: 3,
        });

    const incidents =
        results.documents?.[0]?.map(
            (doc, idx) => ({
                document: doc,
                metadata:
                    results.metadatas?.[0]?.[idx],
            })
        ) || [];

    return {
        retrievedIncidents: incidents,
    };
}

export async function reasoningNode(state: IncidentState): Promise<Partial<IncidentState>> {

    // const prompt = `You are a Kubernetes SRE expert. Analyze these logs:${state.logs} Past incidents: ${JSON.stringify(state.retrievedIncidents)}

    //     Give:
    //     1. probable root causes
    //     2. ranked hypotheses
    //     `;

    const prompt = `
                You are an expert Kubernetes SRE.
                
                Analyze:
                
                LOGS:
                ${state.logs}
                
                CLUSTER CONTEXT:
                ${JSON.stringify(state.clusterContext)}
                
                SIMILAR INCIDENTS:
                ${JSON.stringify(state.retrievedIncidents)}
                
                Provide:
                1. Root cause hypotheses
                2. Severity
                3. Recommended investigation
                4. Most likely fix
                `;

    const response = await llm.invoke(prompt);

    return {
        hypotheses: [response.content.toString()],
    };
}

export async function fixPlannerNode(state: IncidentState): Promise<Partial<IncidentState>> {
    const prompt = `
                You are an SRE remediation agent.

                Based on these hypotheses:

                ${state.hypotheses?.join("\n")}

                Generate:
                - safe remediation steps
                - kubernetes checks
                - debugging commands
                `;

    const response = await llm.invoke(prompt);

    return {
        fixPlan: [response.content.toString()],
    };
}

export async function reportNode(state: IncidentState): Promise<Partial<IncidentState>> {
    const report = `
            # Incident Report
            
            Service: ${state.service}
            
            ## Summary
            ${state.parsedLogs?.summary}
            
            ## Hypotheses
            ${state.hypotheses?.join("\n")}
            
            ## Fix Plan
            ${state.fixPlan?.join("\n")}
            `;

    return {
        finalReport: report,
    };
}

export async function fetchLogsNode(state: IncidentState) {

    const logs = await getPodLogs(state.podName, state.namespace);

    return {
        logs,
    };
}