import type { IncidentState } from "../types/incident";
import {
    getPods,
    getEvents,
} from "../k8s/tools";
import fs from "fs";
import { Writable } from "stream";
import { k8sCoreApi, k8sLog } from "../k8s/client";

export async function k8sInspectionNode(state: IncidentState) {

    console.log(state)
    const pods = await getPods(state.namespace);

    const events = await getEvents(state.namespace);

    return {
        clusterContext: {
            pods,
            events,
        },
    };
}

export async function deploymentResolverNode(state: IncidentState) {

    const namespace = state.namespace;

    const pods = await k8sCoreApi.listNamespacedPod({
        namespace,
    });

    const filtered = pods.items.filter(
        (pod: any) =>
            pod.metadata?.labels?.app ===
            state.deployment
    );

    const mapped = filtered.map((pod: any) => ({
        name: pod.metadata?.name,
        status: pod.status?.phase,
        restarts:
            pod.status?.containerStatuses?.[0]
                ?.restartCount || 0,
    }));

    return {
        resolvedPods: mapped,
    };
}

export async function selectPodNode(state: IncidentState) {
    const pods = state.resolvedPods ?? [];

    if (pods.length === 0) {
        throw new Error("No pods found for deployment");
    }

    // pick worst pod (most restarts)
    const target = [...pods].sort(
        (a, b) => (b.restarts ?? 0) - (a.restarts ?? 0)
    )[0];

    let logs = "";

    const stream = new Writable({
        write(chunk, _, callback) {
            logs += chunk.toString();
            callback();
        },
    });

    await k8sLog.log(state.namespace, target.name, "default", stream);

    return {
        podName: target?.name,
        logs,
    };
}