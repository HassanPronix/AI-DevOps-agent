import type { IncidentState } from "../types/incident";

import {
    getPods,
    getEvents,
} from "../k8s/tools";

export async function k8sInspectionNode(state: IncidentState) {
   
    const pods = await getPods("default");

    const events = await getEvents("default");

    return {
        clusterContext: {
            pods,
            events,
        },
    };
}