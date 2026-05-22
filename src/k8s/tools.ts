import { k8sCoreApi } from "./client";
import fs from "fs/promises";

export async function getPods(namespace = "default") {
    const response = await k8sCoreApi.listNamespacedPod({
        namespace,
    });

    await fs.writeFile(
        "pods.json",
        JSON.stringify(response, null, 2),
        "utf-8"
    );

    return response.items.map((pod) => ({
        name: pod.metadata?.name,
        phase: pod.status?.phase,
        node: pod.spec?.nodeName,
    }));
}

export async function getPodLogs(podName: string, namespace = "default") {
   
    const response = await k8sCoreApi.readNamespacedPodLog({
        name: podName,
        namespace,
        tailLines: 100,
    });

    await fs.writeFile(
        "podsLogs.json",
        JSON.stringify(response, null, 2),
        "utf-8"
    );

    return response;
}

export async function getEvents(namespace = "default") {
    const response = await k8sCoreApi.listNamespacedEvent({
        namespace,
    });

    await fs.writeFile(
        "events.json",
        JSON.stringify(response, null, 2),
        "utf-8"
    );

    return response.items.map((event) => ({
        reason: event.reason,
        message: event.message,
        type: event.type,
    }));
}