import { k8sCoreApi } from "./client";

export async function getPods(namespace = "default") {
    const response = await k8sCoreApi.listNamespacedPod({
        namespace,
    });

    return response.items.map((pod) => ({
        name: pod.metadata?.name,
        phase: pod.status?.phase,
        node: pod.spec?.nodeName,
    }));
}

export async function getPodLogs(
    podName: string,
    namespace = "default"
) {
    const response = await k8sCoreApi.readNamespacedPodLog({
        name: podName,
        namespace,
        tailLines: 100,
    });

    return response;
}

export async function getEvents(namespace = "default") {
    const response = await k8sCoreApi.listNamespacedEvent({
        namespace,
    });

    return response.items.map((event) => ({
        reason: event.reason,
        message: event.message,
        type: event.type,
    }));
}